Tables:
+ Users
+ Highscore

Schema:
+ Users
	+ id		INTEGER		PRIMARY KEY
	+ name		TEXT
	+ passwd	TEXT
	+ score		INTEGER
	+ games		INTEGER
+ Highscore
	+ rank		INTEGER		
	+ user		TEXT		PRIMARY KEY
	+ score		INTEGER
