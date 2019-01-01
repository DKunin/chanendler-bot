'use strict';

import test from 'ava';
import torba from './utils/torba';

test('simple transition', async t => {
    const result = await torba(
        'https://dkun.in/links/2018/12/30/whats-up-frontend.html'
    );
    t.is(result.data.title, 'whats up frontend');
    t.is(result.data.content,
        '<body> <header> <address> <a class="site-title" href="https://dkun.in/">DKBlog</a> <a href="https://t.me/dkunin_blog">https://t.me/dkunin_blog</a> </address>\n</header> <main> <article> <header>30 December 2018</header> <blockquote>Nothing to see here</blockquote> <p>Article fetched.</p> </article> </main> <footer>\n</footer> </body>'
    );
});
