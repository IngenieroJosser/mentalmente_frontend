import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Documentación API - Mentalmente</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css" />
      <style>
        body {
          margin: 0;
          background-color: #fafafa;
        }
        #swagger-ui {
          padding: 20px;
        }
        .swagger-ui .topbar {
          background-color: #19334c;
          padding: 10px 0;
        }
        .swagger-ui .topbar .download-url-wrapper {
          display: none;
        }
      </style>
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js"></script>
      <script>
        window.onload = function() {
          const ui = SwaggerUIBundle({
            url: '/api/docs/swagger',
            dom_id: '#swagger-ui',
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIBundle.SwaggerUIStandalonePreset
            ],
            layout: "BaseLayout",
            deepLinking: true,
            docExpansion: 'none',
            operationsSorter: 'alpha',
            tagsSorter: 'alpha',
            defaultModelsExpandDepth: -1,
            showCommonExtensions: true,
            showExtensions: true,
            oauth2RedirectUrl: window.location.origin + '/api/docs/oauth2-redirect'
          });
          
          window.ui = ui;
        }
      </script>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}