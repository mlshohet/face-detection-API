BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined ) values ('Jessica', 'jess@gmail.com', 5, '2018-01-02');
INSERT into login (hash, email) values ('$2y$12$dyrdh4M3YyFPsZYzdETTOu9Cjt.E1oLtmS9AwFHo8rzutUCB1yY5y', 'jess@gmail.com');

COMMIT;