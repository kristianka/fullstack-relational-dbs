CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes int DEFAULT 0
);

insert into blogs (author, url, title) values ('React devs', 'react.dev', 'React guide');
insert into blogs (author, url, title) values ('Svelte devs', 'svelte.dev', 'Svelte guide');
