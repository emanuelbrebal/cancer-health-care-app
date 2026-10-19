const { getDefaultConfig } = require('expo/metro-config');
const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Preserve Expo's default watchFolders and add the monorepo root.
config.watchFolders = [...(config.watchFolders ?? []), workspaceRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

/** Resolve pacote a partir do app (sobe para node_modules da raiz do monorepo se necessário). */
function resolveMobileDependency(pkg) {
  return path.dirname(
    require.resolve(`${pkg}/package.json`, { paths: [projectRoot] }),
  );
}

/** Prefere cópia hoistada na raiz do workspace (mesma versão para todo o bundle). */
function resolveHoisted(pkg) {
  const atRoot = path.join(workspaceRoot, 'node_modules', pkg);
  if (fs.existsSync(path.join(atRoot, 'package.json'))) {
    return atRoot;
  }
  return resolveMobileDependency(pkg);
}

// Monorepo: uma única cópia de React no bundle (evita "Invalid hook call" / useRef null).
config.resolver.extraNodeModules = {
  react: resolveHoisted('react'),
  'react-dom': resolveHoisted('react-dom'),
  scheduler: resolveHoisted('scheduler'),
};

config.resolver.blockList = [
  new RegExp(`${path.resolve(workspaceRoot, 'apps/backend').replace(/\\/g, '\\\\')}.*`),
  new RegExp(`${path.resolve(workspaceRoot, 'apps/web').replace(/\\/g, '\\\\')}.*`),
  new RegExp(`${path.resolve(workspaceRoot, 'packages/shared/node_modules').replace(/\\/g, '\\\\')}.*`),
];

// Web (preview para gravação/prints): Lottie nativo não tem build web sem dotlottie.
const webStubs = {
  'lottie-react-native': path.resolve(projectRoot, 'src/web-stubs/LottieView.tsx'),
  'react-native-youtube-iframe': path.resolve(projectRoot, 'src/web-stubs/YoutubeIframe.tsx'),
};
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && webStubs[moduleName]) {
    return { type: 'sourceFile', filePath: webStubs[moduleName] };
  }
  return (defaultResolveRequest ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;