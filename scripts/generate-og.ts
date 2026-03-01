import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const WIDTH = 1200
const HEIGHT = 630

// Fetch Inter font (TTF from fontsource CDN — satori requires ttf/woff, not woff2)
async function loadFont(): Promise<ArrayBuffer> {
  const response = await fetch(
    'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.ttf'
  )
  return response.arrayBuffer()
}

async function loadFontBold(): Promise<ArrayBuffer> {
  const response = await fetch(
    'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.ttf'
  )
  return response.arrayBuffer()
}

async function main() {
  const [fontRegular, fontBold] = await Promise.all([loadFont(), loadFontBold()])

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          fontFamily: 'Inter',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Grid lines decoration - vertical
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 200,
                width: 1,
                backgroundColor: 'rgba(255,255,255,0.06)',
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 200,
                width: 1,
                backgroundColor: 'rgba(255,255,255,0.06)',
              },
            },
          },
          // Grid lines decoration - horizontal
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                left: 0,
                right: 0,
                top: 160,
                height: 1,
                backgroundColor: 'rgba(255,255,255,0.06)',
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 160,
                height: 1,
                backgroundColor: 'rgba(255,255,255,0.06)',
              },
            },
          },
          // Plus signs at intersections
          ...[
            { top: 153, left: 193 },
            { top: 153, right: 193 },
            { bottom: 153, left: 193 },
            { bottom: 153, right: 193 },
          ].map((pos) => ({
            type: 'div' as const,
            props: {
              style: {
                position: 'absolute' as const,
                ...pos,
                color: 'rgba(255,255,255,0.15)',
                fontSize: 14,
                fontFamily: 'Inter',
              },
              children: '+',
            },
          })),
          // Green dot + "Open source" badge
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 24,
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 999,
                padding: '6px 14px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#34d399',
                    },
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.5)',
                    },
                    children: 'Free & open source',
                  },
                },
              ],
            },
          },
          // Main heading
          {
            type: 'div',
            props: {
              style: {
                fontSize: 56,
                fontWeight: 700,
                color: '#f5f5f5',
                letterSpacing: '-0.03em',
                marginBottom: 16,
              },
              children: 'One prompt, every AI',
            },
          },
          // Subtitle
          {
            type: 'div',
            props: {
              style: {
                fontSize: 22,
                color: 'rgba(255,255,255,0.45)',
                maxWidth: 600,
                textAlign: 'center' as const,
                lineHeight: 1.5,
              },
              children:
                'Write your prompt once. Get instant deep links to open it in ChatGPT, Claude, Gemini, and more.',
            },
          },
        ],
      },
    },
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: 'Inter', data: fontRegular, weight: 400, style: 'normal' as const },
        { name: 'Inter', data: fontBold, weight: 700, style: 'normal' as const },
      ],
    },
  )

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: WIDTH },
  })
  const pngData = resvg.render()
  const pngBuffer = pngData.asPng()

  const outPath = join(import.meta.dir || process.cwd(), '..', 'public', 'og.png')
  writeFileSync(outPath, pngBuffer)
  console.log(`✓ OG image generated: public/og.png (${pngBuffer.length} bytes)`)
}

main().catch((err) => {
  console.error('Failed to generate OG image:', err)
  process.exit(1)
})
