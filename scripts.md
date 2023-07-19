1. scripts/Break Dump Chunks
Split the dumps into smaller jsons. This was done when I was using github as a database and stuck for the rest of the scripts even as I stopped.

2. scripts/Card Names
Get a text file list of all nations represented in cards, for use in next script

3. scripts/Card CTE test
Gets all nations active in the nations api route from NS, then checks against the card names. This is to get CTE nations but runs so slowly its impractical.

4. Generate Postgres
Connect to a postgres database and run through the cards, adding them to the database

5. Generate SQLite
Same as the above but for sqlite

6. scripts/Get ranges
Quick one time use script that generates ranges for cards for when github was the data fetching solution

7. scripts/huggingFaceFlagMLTest
Test script to see the viability of using a huggingface model to identify nationstates flags