DROP TABLE IF EXISTS News;
CREATE TABLE News (
    id SERIAL PRIMARY KEY,
    title varchar (500),
    description varchar (1000),
    url varchar (1000),
    image varchar (1000)
);