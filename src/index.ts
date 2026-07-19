import type { Context } from 'koishi'
import '@koishijs/plugin-server'
import { createReadStream } from 'node:fs'
import { resolve } from 'node:path'

export const name = 'feature-tester'
export const inject = {
	required: [ "server" ],
};
export const usage = `
<style>
  .mt-radio-zh, .mt-radio-en, .mt-radio-ja, .mt-radio-ru { display: none; }
  .mt-content-zh, .mt-content-en, .mt-content-ja, .mt-content-ru { display: none; }
  .mt-radio-zh:checked ~ .mt-content-zh { display: block; }
  .mt-radio-en:checked ~ .mt-content-en { display: block; }
  .mt-radio-ja:checked ~ .mt-content-ja { display: block; }
  .mt-radio-ru:checked ~ .mt-content-ru { display: block; }
  .mt-lang-switch { text-align: right; margin-bottom: 16px; user-select: none; }
  .mt-lang-switch label {
    display: inline-block;
    padding: 4px 14px;
    font-size: 12px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    cursor: pointer;
    background: #fff;
    color: #666;
    margin-left: 8px;
    transition: all 0.2s;
  }
  .mt-lang-switch label:hover { border-color: #4a6ee0; color: #4a6ee0; }
  .mt-radio-zh:checked ~ .mt-lang-switch label[for="mt-zh"],
  .mt-radio-en:checked ~ .mt-lang-switch label[for="mt-en"],
  .mt-radio-ja:checked ~ .mt-lang-switch label[for="mt-ja"],
  .mt-radio-ru:checked ~ .mt-lang-switch label[for="mt-ru"] {
    background: #4a6ee0; color: #fff; border-color: #4a6ee0;
  }
</style>
<input type="radio" name="mt-lang" id="mt-zh" class="mt-radio-zh" checked>
<input type="radio" name="mt-lang" id="mt-en" class="mt-radio-en">
<input type="radio" name="mt-lang" id="mt-ja" class="mt-radio-ja">
<input type="radio" name="mt-lang" id="mt-ru" class="mt-radio-ru">
<div class="mt-lang-switch">
  <label for="mt-zh">🇨🇳 中文</label>
  <label for="mt-en">🇬🇧 English</label>
  <label for="mt-ja">🇯🇵 日本語</label>
  <label for="mt-ru">🇷🇺 Русский</label>
</div>

<div class="mt-content-zh">
  <div style="border-radius: 10px; border: 1px solid #ddd; padding: 16px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <h2 style="margin-top: 0; color: #722ed1;">📦 插件介绍</h2>
    <p>这是一个特性测试插件，用来测试在 Koishi 上能整什么活。</p>
    <p>会在此尝试各种 Koishi 框架特性、API 与玩法，验证可行性。</p>
  </div>
  <div style="border-radius: 10px; border: 1px solid #ddd; padding: 16px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <h2 style="margin-top: 0; color: #52c41a;">🧪 测试范围</h2>
    <p>探索指令、中间件、服务、数据库、定时任务、Web API 等能力，看看能整出什么花样。</p>
  </div>
</div>

<div class="mt-content-en">
  <div style="border-radius: 10px; border: 1px solid #ddd; padding: 16px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <h2 style="margin-top: 0; color: #722ed1;">📦 Introduction</h2>
    <p>This is a feature-testing plugin, used to test what kind of tricks can be done on Koishi.</p>
    <p>Various Koishi framework features, APIs, and use cases will be tried out here to verify feasibility.</p>
  </div>
  <div style="border-radius: 10px; border: 1px solid #ddd; padding: 16px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <h2 style="margin-top: 0; color: #52c41a;">🧪 Test Scope</h2>
    <p>Exploring commands, middleware, services, databases, scheduled tasks, Web APIs, and more — to see what's possible.</p>
  </div>
</div>

<div class="mt-content-ja">
  <div style="border-radius: 10px; border: 1px solid #ddd; padding: 16px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <h2 style="margin-top: 0; color: #722ed1;">📦 プラグイン紹介</h2>
    <p>これは機能テスト用プラグインで、Koishi でどんなことができるか試すために使います。</p>
    <p>Koishi フレームワークの各種機能・API・使い方をここで検証します。</p>
  </div>
  <div style="border-radius: 10px; border: 1px solid #ddd; padding: 16px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <h2 style="margin-top: 0; color: #52c41a;">🧪 テスト範囲</h2>
    <p>コマンド・ミドルウェア・サービス・データベース・定期タスク・Web API などを探索し、何ができるか確かめます。</p>
  </div>
</div>

<div class="mt-content-ru">
  <div style="border-radius: 10px; border: 1px solid #ddd; padding: 16px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <h2 style="margin-top: 0; color: #722ed1;">📦 Введение</h2>
    <p>Это плагин для тестирования функций, используется чтобы проверить, что можно сделать на Koishi.</p>
    <p>Здесь проверяются различные возможности, API и приёмы фреймворка Koishi на пригодность.</p>
  </div>
  <div style="border-radius: 10px; border: 1px solid #ddd; padding: 16px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <h2 style="margin-top: 0; color: #52c41a;">🧪 Область тестирования</h2>
    <p>Исследование команд, промежуточного ПО, сервисов, баз данных, планировщика задач, Web API и т. д. — чтобы увидеть, на что способен.</p>
  </div>
</div>

<div style="border-radius: 10px; border: 1px solid #ddd; padding: 16px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
  <h2 style="margin-top: 0; color: #fa541c;">🎬 新宝岛</h2>
  <video controls playsinline preload="metadata" style="width: 100%; max-width: 100%; border-radius: 8px; display: block; background: #000;" src="/feature-tester/xbdao.mp4"></video>
</div>
`;

export function apply(ctx: Context) {
  ctx.server.get('/feature-tester/xbdao.mp4', (koa) => {
    koa.type = 'video/mp4'
    koa.body = createReadStream(resolve(__dirname, '..', 'assets', '新宝岛.mp4'))
  })
}
