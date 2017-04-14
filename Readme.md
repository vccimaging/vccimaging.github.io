# Computational imaging group web

These are the group web pages for the computational imaging group at KAUST VCC.

The structure is to use Jekyll to create static web pages for people, publications, and projects.

### Publications

Publications are kept in a YAML database in ```_data/publications.yaml```. This file consists of entries of the following format:

```
- id: UniqueID
  authors:
    - First Author
    - Second Author
    - etc.
  title: My Title
  venue: Some journal or conference
  year: 2016
  thumbnail: <URL for a 100x100 thumbnail>
  pdf: <URL for a PDF of the publication>
  url: <URL for a project directory>
```

At least ```authors```, ```title```, ```venue```, and ```year``` must be present for a publication to show up in a publication list. **Note:** any data value (e.g. title or url) containign a colon (':') must be enclosed in double quotes.

The ```UniqueID``` is a unique identifier for each paper (Something like ```<Author><year><project acronym>```) that is used to automatically create links to thumbnail images and PDFs if the following files exist:

- ```<UniqueID>/thumb.jpg```: thumbnail image
- ```<UniqueID>/<UniqueID>.pdf```: PDF of the article
- ```<UniqueID>/published```: project page linked to ```<UniqueID>/index.html```


Each publication may have additional fields (e.g. ```volume```, ```number``` etc.). These are currently ignored but may be used in the future for purposes like automatic generation of BibTeX entries. 


### To Do:

- Projects:
  - directory structure for projects
  - template for projects
  - automatic bibtex generation?
- People:
  - directory structure for home pages
  - template / example page for a home page
    - image
    - bio
    - short list of publications
    - 
