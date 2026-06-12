-- ============================================
-- 标签系统数据库设置
-- 在 Supabase SQL Editor 执行此脚本
-- ============================================

-- 1. 创建标签表
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,  -- 标签名称，如 "暗恋表白"
  slug TEXT UNIQUE NOT NULL,   -- URL 友好的名称，如 "love-confession"
  category TEXT,               -- 所属分类：love, work, family, life, other
  description TEXT,            -- 标签描述（SEO）
  count INT DEFAULT 0,         -- 使用次数
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 创建秘密-标签关联表
CREATE TABLE IF NOT EXISTS secret_tags (
  secret_id UUID REFERENCES secrets(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (secret_id, tag_id)
);

-- 3. 创建索引（提高查询性能）
CREATE INDEX IF NOT EXISTS idx_tags_category ON tags(category);
CREATE INDEX IF NOT EXISTS idx_tags_count ON tags(count DESC);
CREATE INDEX IF NOT EXISTS idx_secret_tags_secret ON secret_tags(secret_id);
CREATE INDEX IF NOT EXISTS idx_secret_tags_tag ON secret_tags(tag_id);

-- 4. 创建触发器：自动更新标签使用次数
CREATE OR REPLACE FUNCTION update_tag_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tags SET count = count + 1 WHERE id = NEW.tag_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tags SET count = count - 1 WHERE id = OLD.tag_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tag_count
AFTER INSERT OR DELETE ON secret_tags
FOR EACH ROW EXECUTE FUNCTION update_tag_count();

-- 5. 插入预设标签（按分类）
INSERT INTO tags (name, slug, category, description) VALUES
  -- 感情类
  ('暗恋表白', 'love-confession', 'love', '那些不敢说出口的暗恋和表白'),
  ('失恋分手', 'breakup', 'love', '分手后的心痛和释怀'),
  ('异地恋', 'long-distance', 'love', '异地恋的思念与煎熬'),
  ('出轨背叛', 'cheating', 'love', '感情中的背叛与伤害'),
  ('单身狗', 'single', 'love', '单身的孤独与自由'),
  
  -- 工作类
  ('职场压力', 'work-stress', 'work', '工作压力和职场焦虑'),
  ('老板吐槽', 'boss-complaint', 'work', '吐槽老板的奇葩行为'),
  ('加班熬夜', 'overtime', 'work', '无尽的加班和熬夜'),
  ('想辞职', 'want-quit', 'work', '辞职的冲动和纠结'),
  ('职场PUA', 'workplace-pua', 'work', '职场PUA和精神压迫'),
  
  -- 家庭类
  ('家庭矛盾', 'family-conflict', 'family', '家庭成员之间的矛盾'),
  ('父母唠叨', 'parents', 'family', '父母的唠叨和不理解'),
  ('婆媳关系', 'mother-in-law', 'family', '婆媳关系的困扰'),
  ('重男轻女', 'gender-bias', 'family', '家庭中的性别歧视'),
  ('催婚压力', 'marriage-pressure', 'family', '来自家人的催婚压力'),
  
  -- 生活类
  ('大学生活', 'college-life', 'life', '大学生的生活和烦恼'),
  ('考研压力', 'exam-stress', 'life', '考研考试的巨大压力'),
  ('失眠焦虑', 'insomnia', 'life', '深夜的失眠和焦虑'),
  ('孤独寂寞', 'lonely', 'life', '一个人的孤独时刻'),
  ('经济压力', 'money-stress', 'life', '经济和生活的压力'),
  
  -- 其他类
  ('深夜想法', 'midnight-thoughts', 'other', '深夜里的胡思乱想'),
  ('秘密树洞', 'secret', 'other', '不敢告诉任何人的秘密'),
  ('真心话', 'confession', 'other', '说出真实的想法'),
  ('匿名吐槽', 'anonymous-rant', 'other', '匿名吐槽和发泄')
ON CONFLICT (name) DO NOTHING;

-- 6. 完成提示
SELECT 'Tags system setup completed! 标签系统设置完成！' AS status;
SELECT COUNT(*) AS total_tags FROM tags;
