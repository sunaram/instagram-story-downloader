# instagram-story-downloader  
Download stories from a given list of public instagram profiles or accounts you follow.  
__Please note that, I don't endorse violating Instagram's policy__  

# Running the downloader  
```
1. Download the appropriate executable from the release page https://github.com/sunaram/instagram-story-downloader/releases
2. Create a csv file named usernames.csv (or a text file named usernames.txt) with the target IG usernames, one per line in the same directory as the executable    
e.g.   
natalee.007  
mathildtantot  
3. Run commands like this
```
On __Windows__,
```
app-win.exe -u YOUR_IG_USERNAME -p YOUR_IG_PASSWORD -i usernames.csv (or usernames.txt)
```
On __Linux__,
```
1. chmod a+x app-linux
2. ./app-linux -u YOUR_IG_USERNAME -p YOUR_IG_PASSWORD -i usernames.csv (or usernames.txt)
```
On __Mac__,
```
1. chmod a+x app-mac
2. ./app-mac -u YOUR_IG_USERNAME -p YOUR_IG_PASSWORD -i usernames.csv (or usernames.txt)
```

# Where's the downloaded stories?  
Inside the "downloads" folder that's in the same directory as the executable
