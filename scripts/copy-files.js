// scripts/ultimate-copy.js
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 启动终极复制解决方案\n')

const rootDir = process.cwd()

// 1. 打印调试信息
console.log('=== 调试信息 ===')
console.log('当前目录:', rootDir)
console.log('node版本:', process.version)
console.log('平台:', process.platform)
console.log('')

// 2. 强制创建目录结构
console.log('=== 创建目录结构 ===')
const dirs = [
  'dist/dev/mp-weixin',
  'dist/dev/mp-weixin/cloudfunctions',
  'dist/dev/mp-weixin/pages',
  'dist/dev/mp-weixin/static'
]

dirs.forEach(dir => {
  const fullPath = path.join(rootDir, dir)
  if (!fs.existsSync(fullPath)) {
    try {
      fs.mkdirSync(fullPath, { recursive: true })
      console.log(`✅ 创建目录: ${dir}`)
    } catch (error) {
      console.log(`❌ 创建失败 ${dir}: ${error.message}`)
    }
  } else {
    console.log(`✅ 目录已存在: ${dir}`)
  }
})

console.log('')

// 3. 使用系统命令复制文件（最可靠）
console.log('=== 复制文件 ===')

// 复制 project.config.json
const configSource = path.join(rootDir, 'project.config.json')
const configDest = path.join(rootDir, 'dist/dev/mp-weixin/project.config.json')

if (fs.existsSync(configSource)) {
  try {
    // 使用系统 copy 命令（最可靠）
    if (process.platform === 'win32') {
      // Windows
      execSync(`copy "${configSource}" "${configDest}"`, { stdio: 'inherit' })
    } else {
      // macOS/Linux
      execSync(`cp "${configSource}" "${configDest}"`, { stdio: 'inherit' })
    }
    console.log('✅ project.config.json 复制成功')
  } catch (error) {
    // 如果系统命令失败，使用 Node.js 的 fs 模块
    try {
      fs.copyFileSync(configSource, configDest)
      console.log('✅ project.config.json 复制成功（使用 Node.js）')
    } catch (fsError) {
      console.log(`❌ 复制失败: ${fsError.message}`)
    }
  }
} else {
  console.log('⚠️  project.config.json 不存在，创建默认配置')
  
  const defaultConfig = {
    "description": "项目配置文件",
    "packOptions": {
      "ignore": []
    },
    "setting": {
      "urlCheck": true,
      "es6": true,
      "enhance": false,
      "postcss": true,
      "preloadBackgroundData": false,
      "minified": true,
      "newFeature": false,
      "autoAudits": false,
      "coverView": true,
      "showShadowRootInWxmlPanel": true,
      "scopeDataCheck": false,
      "checkInvalidKey": true,
      "checkSiteMap": true,
      "uploadWithSourceMap": true,
      "babelSetting": {
        "ignore": [],
        "disablePlugins": [],
        "outputPath": ""
      }
    },
    "compileType": "miniprogram",
    "libVersion": "2.19.4",
    "appid": "",
    "projectname": "台球计分",
    "miniprogramRoot": "./",
    "cloudfunctionRoot": "cloudfunctions/",
    "condition": {}
  }
  
  try {
    fs.writeFileSync(configDest, JSON.stringify(defaultConfig, null, 2))
    console.log('✅ 已创建默认 project.config.json')
  } catch (error) {
    console.log(`❌ 创建失败: ${error.message}`)
  }
}

console.log('')

// 4. 复制 cloudfunctions 目录
console.log('=== 复制 cloudfunctions 目录 ===')
const cloudSource = path.join(rootDir, 'cloudfunctions')
const cloudDest = path.join(rootDir, 'dist/dev/mp-weixin/cloudfunctions')

if (fs.existsSync(cloudSource)) {
  // 删除目标目录（如果存在）
  if (fs.existsSync(cloudDest)) {
    try {
      fs.rmSync(cloudDest, { recursive: true, force: true })
      console.log('🗑️  清理旧 cloudfunctions 目录')
    } catch (error) {
      console.log(`⚠️  清理失败: ${error.message}`)
    }
  }
  
  // 使用系统命令复制
  try {
    if (process.platform === 'win32') {
      // Windows: 使用 xcopy
      execSync(`xcopy "${cloudSource}" "${cloudDest}" /E /I /Y /EXCLUDE:node_modules`, 
        { stdio: 'inherit' })
    } else {
      // macOS/Linux: 使用 cp -r，排除 node_modules
      execSync(`cp -r "${cloudSource}" "${cloudDest}"`, { stdio: 'inherit' })
      // 清理 node_modules（如果被复制了）
      const nodeModulesPath = path.join(cloudDest, 'node_modules')
      if (fs.existsSync(nodeModulesPath)) {
        fs.rmSync(nodeModulesPath, { recursive: true, force: true })
        console.log('🗑️  清理 node_modules 目录')
      }
    }
    console.log('✅ cloudfunctions 复制成功')
  } catch (error) {
    console.log(`⚠️  系统复制失败: ${error.message}`)
    console.log('尝试使用 Node.js 复制...')
    
    // 使用 Node.js 递归复制
    copyDirRecursive(cloudSource, cloudDest)
  }
} else {
  console.log('⚠️  cloudfunctions 目录不存在')
}

console.log('')

// 5. 验证复制结果
console.log('=== 验证复制结果 ===')
const verifyFiles = [
  configDest,
  cloudDest,
  path.join(cloudDest, 'login'),
  path.join(cloudDest, 'login/index.js')
]

verifyFiles.forEach(file => {
  const exists = fs.existsSync(file)
  const type = exists ? (fs.statSync(file).isDirectory() ? '目录' : '文件') : '不存在'
  console.log(`${exists ? '✅' : '❌'} ${path.relative(rootDir, file)}: ${type}`)
})

console.log('\n🎉 终极复制脚本执行完成！')

// 递归复制目录的辅助函数
function copyDirRecursive(source, target) {
  if (!fs.existsSync(source)) return
  
  // 创建目标目录
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true })
  }
  
  const items = fs.readdirSync(source)
  let copied = 0
  
  for (const item of items) {
    const sourcePath = path.join(source, item)
    const targetPath = path.join(target, item)
    
    // 跳过 node_modules 和隐藏文件
    if (item === 'node_modules' || item.startsWith('.')) {
      continue
    }
    
    try {
      const stat = fs.statSync(sourcePath)
      
      if (stat.isDirectory()) {
        copyDirRecursive(sourcePath, targetPath)
        copied++
      } else {
        fs.copyFileSync(sourcePath, targetPath)
        copied++
      }
    } catch (error) {
      console.log(`复制 ${item} 失败: ${error.message}`)
    }
  }
  
  console.log(`📄 复制了 ${copied} 个文件/目录`)
}