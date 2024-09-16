/** @type {import('next').NextConfig} */
const nextConfig = {
  // Adicione essa linha para gerar o arquivo routes-manifest.json
  generateBuildId: async () => {
    return 'build'
  },
  // Adicione essa linha para especificar o diretório de saída
  distDir: 'build',
}

export default nextConfig
