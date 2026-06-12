export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-purple-600 mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">这个秘密不存在或已被删除</p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
        >
          返回首页
        </a>
      </div>
    </div>
  )
}
