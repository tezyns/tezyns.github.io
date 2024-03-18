import pug from 'pug'
import * as sass from 'sass'
import fs from 'fs-extra'
import fg from 'fast-glob'
import path from 'node:path'
import matter from 'gray-matter'
import hljs from 'highlight.js'
import markdownIt from 'markdown-it'
import yaml from 'js-yaml'

/**
 * 글로벌 변수 초기화
 */
const $root = process.env.PWD
hljs.registerLanguage('pseudo', function(hljs) {
  return {
    aliases: ['ps'],
    contains: [
      {
        className: 'comment',
        begin: /#/,
        end: /\s\s|\n|$/,
      },
      {
        className: 'strong',
        begin: /\b[A-Z][A-Z0-9]*\b/,
      },
      {
        className: 'number',
        begin: /\b[0-9]+\b/,
      },
      {
        className: 'leadline',
        begin: /[\/|\\▲▶▼◀+-∧>∨<]+/,
      },
    ],
  }
})
const parse_md = markdownIt({
  html: true,
  xhtmlOut: true,
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'

    let lines = code.trim().split('\n')
    let tar_line = new Map()
    let code_modified = lines.map((x, i) => {
      if (x.startsWith('/-') || x.startsWith('/+') || x.startsWith('/=')) {
        tar_line.set(i, x[1])
        x = x.slice(2)
      }
      return x
    }).join('\n')

    lines = hljs.highlight(code_modified, { language }).value.trim().split('\n')
    return lines.map((x, i) => {
      return `<div class="codeline ${tar_line.get(i) || ''}">${x || ' '}</div>`
    }).join('')
  },
})

/**
 * pages 빌드
 * 
 * 로컬에 저장된 현재의 page 목록을 old page 목록으로 로딩
 * 
 * markdown 에 ver(파일명의 대괄호 부분, 정렬 또는 update 판단 용도) 달려있는 경우만 빌드할지 결정
 *   - old page 목록에 없거나(created), old page 목록의 ver 가 달라진 경우(updated) markdown -> html -> json 빌드
 *   - old page 목록에는 있는데 new page 목록에는 없는 경우(removed) json 삭제
 * 
 * 가장 먼저 검색되는 yaml || yml 파일 내용을 읽어서 네비게이션 json 빌드
 * 
 * index.html, 404.html 빌드
 * 
 * sitemap.xml 빌드
 * 
 * 빌드 끝낸 후 new page 목록을 로컬에 저장 
 */
async function build_pages() {
  let build_count = 0

  // old page 목록 로딩
  const pageinfos = (() => {
    try {
      return fs.readJSONSync($root + '/_site/pageinfos.json')
    } catch(e) {
      return []
    }
  })()
  const pageinfos_old = new Map(pageinfos.map(info => [info.name, info]))

  // markdown -> html -> json
  const pageinfos_new = new Map()
  const mdfiles = fg.globSync($root + '/_pages/**/*.md')
  for (let mdfile of mdfiles) {
    const parsed = path.parse(mdfile)
    const ver = (parsed.name.match(/^\[\S*\]/g) || [])[0]

    // ver 있는 경우만,
    if (ver) {
      const name = parsed.name.replace(ver, '')

      // created or updated 된 경우만,
      if (!pageinfos_old.has(name) || pageinfos_old.get(name).ver !== ver) {
        const cat = parsed.dir.split('/_pages')[1]
        const jsonfile = $root + ((cat === '' || cat === '/') ? '/_site/pages/' : '/_site/pages/post/') + name + '.json'
        const pathname = (((cat === '' || cat === '/') ? '/' : '/post/') + name).replace('/index', '/')
        
        // json 빌드
        const {content, data} = matter.read(mdfile, {
          engines: { yaml: s => yaml.load(s, { schema: yaml.JSON_SCHEMA }) }
        })
        const render = pug.compileFile($root + '/_layouts/page.pug')
        fs.outputJSONSync(jsonfile, {name, ver, cat, pathname, ...data, content: render({content: parse_md.render(content), ...data})}, 'utf-8')
        build_count += 1
        pageinfos_new.set(name, {name, ver, cat, pathname, ...data, mdfile, jsonfile})
      } else {
        pageinfos_new.set(name, pageinfos_old.get(name))
      }
    }
  }
  console.log('===> ' + build_count + ' page(s) converted')

  // new page 목록에 없는 json 삭제
  for (let [name, info] of pageinfos_old) {
    if (!pageinfos_new.has(name)) {
      try {
        fs.unlinkSync(info.jsonfile)
      } catch(e) {
        console.log('pageinfos.json 파일이 뭔가 잘못된 것 같습니다. pageinfos.json 파일을 삭제하고 재실행 해주세요.')
        break
      }
    }
  }

  // 네비게이션 json 빌드
  const yamlfile = fg.globSync($root + '/_pages/**/*.{yaml,yml}')[0]
  const navmenu = yaml.load(fs.readFileSync(yamlfile, 'utf8'))
  const pages = [...pageinfos_new.values()]
  for (let [sup, sub] of Object.entries(navmenu)) {
    const render = pug.compileFile($root + '/_layouts/nav.pug')
    const pathname = '/' + sup.toLocaleLowerCase()
    const jsonfile = $root + '/_site/pages' + pathname + '.json'
    fs.outputJSONSync(jsonfile, {pathname, title: sup.toLocaleLowerCase() + ' 카테고리', content: render({pages, cats: sub})}, 'utf-8')
  }
  console.log('===> navigation pages converted')

  // base.pug -> index.html & 404.html
  {
    const menus = Object.keys(navmenu).map(sup => {
      return { pathname: '/' + sup.toLocaleLowerCase(), title: sup }
    })
    const render = pug.compileFile($root + '/_layouts/base.pug')
    fs.outputFileSync($root + '/_site/index.html', render({menus}), 'utf-8')
    fs.copyFileSync($root + '/_site/index.html', $root + '/_site/404.html')
  }
  console.log('===> index.html converted')

  // sitemap.xml 빌드
  {
    const render = pug.compileFile($root + '/_layouts/sitemap.pug')
    fs.outputFileSync($root + '/_site/index.html', render({pages}), 'utf-8')
  }
  console.log('===> sitemap.xml updated')

  // new page 목록 저장
  fs.outputJsonSync($root + '/_site/pageinfos.json', pages)
}


/**
 * assets 빌드
 */
async function build_assets() {
  // // disable jekyll
  // fs.outputFileSync($root + '/_site/.nojekyll', ' ', 'utf-8')

  // main.scss -> main.css
  const css = await sass.compileAsync($root + '/_assets/main.scss', {style: 'compressed'})
  fs.outputFileSync($root + '/_site/assets/main.css', css.css, 'utf-8')
  
  // copy static assets
  fs.copySync($root + '/_assets', $root + '/_site/assets', {
    filter: (from, to) => {
      return !from.includes('main.scss')
    }
  })
}


/**
 * 진입점
 */
switch (process.argv[2]) {
  case 'pages':
    build_pages()
    break
  case 'assets':
    build_assets()
    break
  case 'all':
    fs.removeSync($root + '/_site')
    build_pages()
    build_assets()
    break
}