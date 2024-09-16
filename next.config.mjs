console.log('Carregando next.config.js...')
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...
  exportPathMap: async () => {
    return { '/': { page: '/' } }
  },
  // ...
}

export default nextConfig
