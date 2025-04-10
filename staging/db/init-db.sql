CREATE TABLE leaderboard
(
  playerid SERIAL UNIQUE PRIMARY KEY,
  playername VARCHAR(20) DEFAULT('unknown'),
  score INT NOT NULL
);

ALTER TABLE leaderboard
  OWNER TO dockeruser;
ALTER ROLE dockeruser CONNECTION LIMIT -1;


