# Computational imaging group web

These are the group web pages for the computational imaging group at KAUST VCC.

The structure is to use Jekyll to create static web pages for people, publications, and projects.

### Publications

Publications are kept in a YAML database in ```_data/publications.yaml```. This file consists of entries of the following format:

```
- PublicationHandle:
  authors:
    - First Author
    - Second Author
    - etc.
  title: My Title
  venue: Some journal or conference
  year: 2016
  image: <URL for a 100x100 thumbnail>
  pdf: <URL for a PDF of the publication>
  project: <URL for a project directory>
```

At least ```authors```, ```title```, ```venue```, and ```year``` must be present for a publication to show up in a publication list.

The ```PublicationHandle``` is a unique identifier for each paper (Something like ```<Author><year><project acronym>```). Each publication may have additional fields (e.g. ```volume```, ```number``` etc.). These are currently ignored but may be used in the future for purposes like automatic generation of BibTeX entries. 


### To Do:

- Projects:
  - directory structure for projects
  - naming convention for thumbnails, pdfs
  - template for projects
  - automatic bibtex generation?
- Publications:
  - implicitly use thumbnails, pdfs from project directories
  - modularize the list generation into an include
- People:
  - directory structure for home pages
  - YAML file for people
  - template / example page for a home page
    - image
    - bio
    - short list of publications
    - 
