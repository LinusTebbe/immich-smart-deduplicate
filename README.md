# immich-smart-deduplicate

This project aims to bulk process immich duplicates

It will sort the duplicated assets by album count, then timestamp, then resolution and only keep the first result

## Usage

```bash
git clone https://github.com/LinusTebbe/immich-smart-deduplicate.git
cp .env.dist .env
```
Afterwards add your own values to the `.env` file

Now you only have to execute 
```bash
node app.js 
```