const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

function activate(context) {
  let disposable = vscode.commands.registerCommand('algorithmvisualizer.start', function () {
    const buildPath = path.join(context.extensionPath, 'build');
    
    const panel = vscode.window.createWebviewPanel(
      'algoVis',
      'Algorithm Visualizer',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.file(context.extensionPath)]
      }
    );

    panel.webview.html = getWebviewContent(panel.webview, buildPath);
  });

  context.subscriptions.push(disposable);
}

function getWebviewContent(webview, buildPath) {
  const indexPath = path.join(buildPath, 'index.html');

  if (!fs.existsSync(indexPath)) {
    vscode.window.showErrorMessage('Error: build/index.html no existe.');
    return '';
  }

  let html = fs.readFileSync(indexPath, 'utf-8');

  const baseUri = webview.asWebviewUri(vscode.Uri.file(buildPath));

  html = html.replace('<head>', `<head><base href="${baseUri}/">`);


  const historyPatch = `
    <script>
      (function() {
        console.log("Parcheando History API para VS Code...");
        const _pushState = history.pushState;
        const _replaceState = history.replaceState;
        
        history.pushState = function(state, title, url) {
          console.log("[VS Code] Ignorando history.pushState a: " + url);
          // No hacemos nada real para evitar SecurityError
        };
        
        history.replaceState = function(state, title, url) {
          console.log("[VS Code] Ignorando history.replaceState a: " + url);
          // No hacemos nada real para evitar SecurityError
        };
      })();
    </script>
  `;

  html = html.replace('<head>', `<head>${historyPatch}`);


  const csp = `<meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;">`;
  html = html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/g, '');
  html = html.replace('<head>', `<head>${csp}`);

  const hideErrorOverlay = `
    <style>
      nextjs-portal, #__next-build-watcher, #next-route-announcer { display: none !important; }
    </style>
  `;
  html = html.replace('</head>', `${hideErrorOverlay}</head>`);

  return html;
}

function deactivate() {}

module.exports = { activate, deactivate }