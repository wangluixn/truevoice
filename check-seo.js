#!/usr/bin/env node

/**
 * SEO检查脚本
 * 使用方法：node check-seo.js [URL]
 * 例如：node check-seo.js https://truevoice.fit
 */

const https = require('https');
const http = require('http');

const baseUrl = process.argv[2] || 'http://localhost:3005';

console.log(`\n🔍 检查 SEO 配置：${baseUrl}\n`);

// 检查函数
async function checkUrl(url, expectedContent) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const status = res.statusCode;
        const success = status === 200;
        const hasContent = expectedContent ? data.includes(expectedContent) : true;
        
        resolve({ 
          url, 
          status, 
          success: success && hasContent,
          contentLength: data.length,
          hasExpectedContent: hasContent
        });
      });
    }).on('error', (err) => {
      resolve({ url, status: 0, success: false, error: err.message });
    });
  });
}

// 执行检查
(async () => {
  const checks = [
    {
      name: 'Sitemap',
      url: `${baseUrl}/sitemap.xml`,
      expected: '<urlset'
    },
    {
      name: 'Robots.txt',
      url: `${baseUrl}/robots.txt`,
      expected: 'User-Agent'
    },
    {
      name: '首页',
      url: baseUrl,
      expected: 'TrueVoice'
    }
  ];

  console.log('📋 基础检查：\n');
  
  for (const check of checks) {
    const result = await checkUrl(check.url, check.expected);
    const icon = result.success ? '✅' : '❌';
    const status = result.status || '无法连接';
    
    console.log(`${icon} ${check.name}`);
    console.log(`   URL: ${check.url}`);
    console.log(`   状态: ${status}`);
    
    if (result.error) {
      console.log(`   错误: ${result.error}`);
    } else {
      console.log(`   大小: ${result.contentLength} bytes`);
      if (check.expected && !result.hasExpectedContent) {
        console.log(`   ⚠️  缺少预期内容: "${check.expected}"`);
      }
    }
    console.log('');
  }

  // 获取sitemap中的第一个秘密URL
  console.log('🔗 检查秘密详情页：\n');
  
  const sitemapResult = await checkUrl(`${baseUrl}/sitemap.xml`);
  if (sitemapResult.success) {
    const sitemapData = await new Promise((resolve) => {
      const client = baseUrl.startsWith('https') ? https : http;
      client.get(`${baseUrl}/sitemap.xml`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      });
    });

    const secretMatch = sitemapData.match(/<loc>[^<]*\/secret\/([^<]+)<\/loc>/);
    if (secretMatch) {
      const secretId = secretMatch[1];
      const secretUrl = `${baseUrl}/secret/${secretId}`;
      const result = await checkUrl(secretUrl, '匿名倾诉');
      const icon = result.success ? '✅' : '❌';
      
      console.log(`${icon} 秘密详情页（示例）`);
      console.log(`   URL: ${secretUrl}`);
      console.log(`   状态: ${result.status}`);
      console.log(`   大小: ${result.contentLength} bytes`);
      
      if (!result.hasExpectedContent) {
        console.log(`   ⚠️  页面可能是404或内容不完整`);
      }
    } else {
      console.log('⚠️  Sitemap中未找到秘密URL');
    }
  } else {
    console.log('❌ 无法获取Sitemap，跳过详情页检查');
  }

  console.log('\n📊 检查完成！\n');
  
  console.log('下一步：');
  console.log('1. 确保所有检查都显示 ✅');
  console.log('2. 在浏览器中打开秘密详情页，查看页面源代码');
  console.log('3. 确认HTML中包含完整的秘密内容（不是Loading...）');
  console.log('4. 部署到生产环境后，在Google Search Console提交sitemap');
  console.log('');
})();
