# Gist

I created this website to help me read, edit and manage the gists I use for studying. Over the years I have created a bunch of gists with my notes about computer science. I always had to use another software to edit them. Now I have my own website to read and edit my notes. 

In order to access your gists you need to have a github token with the correct permissions. In Github go to Settings -> Developer Settings -> Personal access tokens, to create one.  

The only thing I'm really missing is uploading the images. Since I do not have a domain for this app, I didn't see the point in building the upload feature. I will continue to upload the images to gist.github as I have done so far.  

I don't use multiple files in a single gist, so the website won't edit them either. 

The API returns a flag called truncated; I don't use it either. 

I do not use the revisions. 

In the next version I will add these four features.

Bugs:

- This will crash the editor <= >=, you need to escape it: \<= >=.