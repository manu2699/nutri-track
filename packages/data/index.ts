// // src/index.tsx
// import { Hono } from 'hono'
// import { serve } from '@hono/node-server'
// import { readFileSync, writeFileSync, existsSync } from 'fs'
// import { join } from 'path'

// const DATA_FILE = join(process.cwd(), 'db.json')
// if (!existsSync(DATA_FILE)) writeFileSync(DATA_FILE, JSON.stringify({}, null, 2))

// const app = new Hono()

// app.get("/", (c) => {
//     // const foods = JSON.parse(readFileSync(DATA_FILE, 'utf8'));
//     return c.html(`
//       <html lang="en">
//         <head>
//             <meta charset="UTF-8" />
//             <title>Nutri Track DB Editor</title>
//             <meta name="viewport" content="width=device-width,initial-scale=1" />
//             <script src="https://cdn.tailwindcss.com"></script>
//             <script type="module" src="/src/client.tsx" />
//         </head>
//         <body>
//           <div id="root" />
//         </body>
//       </html>
//     `);
//   });

// // File save/modify
// app.post('/', async (c) => {
//   const data = await c.req.json()
//   try {
//     writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
//     return c.json({ ok:true })
//   } catch (e) {
//     return c.json({ ok:false, error:"Could not write file." })
//   }
// })

// serve({ fetch: app.fetch, port: 3000 })
// console.log('Server running at http://localhost:3000')
