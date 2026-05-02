#!/usr/bin/env node
"use strict";

// End-to-end smoke test for the CMS-backed site
// Verifies Strapi endpoints and a basic frontend state via HTTP requests.

const BASE = process.env.STRAPI_BASE_URL || 'http://localhost:1337'
const DO_POST = process.env.DO_POST === '1' || process.env.DO_POST === 'true'

async function fetchJson(url, opts = {}) {
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`)
  try {
    return await res.json()
  } catch {
    return null
  }
}

async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`POST failed ${res.status} ${res.statusText} for ${url}`)
  try {
    return await res.json()
  } catch {
    return null
  }
}

async function main() {
  console.log(`Running CMS smoke test against ${BASE}`)
  const endpoints = [
    { path: '/api/services', label: 'Services' },
    { path: '/api/testimonials', label: 'Testimonials' },
    { path: '/api/homepage', label: 'Homepage singleton' },
    { path: '/api/site-theme', label: 'Site Theme singleton' },
  ]

  let ok = true
  for (const ep of endpoints) {
    try {
      const data = await fetchJson(`${BASE}${ep.path}`)
      if (!data) {
        console.error(`No data for ${ep.label} (${ep.path})`)
        ok = false
      } else {
        console.log(`OK: ${ep.label} -> ${ep.path}`)
      }
    } catch (err) {
      console.error(`ERR: ${ep.label} -> ${ep.path}:`, err.message)
      ok = false
    }
  }

  if (DO_POST) {
    try {
      const payload = { data: { name: 'Smoke Tester', email: 'test@example.com', message: 'Hello from smoke test' } }
      const res = await postJson(`${BASE}/api/contact-submissions`, payload)
      console.log('Contact submission response:', res?.data ?? res)
    } catch (err) {
      console.error('POST to contact-submissions failed:', err.message)
      ok = false
    }
  } else {
    console.log('POST not enabled. Skipping contact-submission test. Set DO_POST=1 to enable.')
  }

  if (ok) {
    console.log('CMS smoke test: PASS')
    process.exit(0)
  } else {
    console.error('CMS smoke test: FAIL')
    process.exit(1)
  }
}

main().catch((e) => {
  console.error('Smoke test crashed:', e)
  process.exit(2)
})
