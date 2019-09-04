# Computational imaging group web

These are the group web pages for the computational imaging group at KAUST VCC.

The structure is to use Jekyll to create static web pages for people, publications, and projects.

### People

People records are kept in a YAML database in ```_data/people.yaml```, with entries as follows:

```
- id: UniqueID
  name: Full Name
  pubname: F. Name
  title: <academic title>
  position: <position at KAUST>
  start: <year of joining KAUST>
  end: <last year at KAUST>
```

The ```title``` can be empty; examples for ```position``` are "Research Scientist" or "Ph.D student". ```end``` should only be added once a person has left the university -- the person will then be listed as an alumni.

It is important that the ```pubname``` is spelled exactly as the name in the publication databases, otherwise automatic generation of publication lists will be incomplete.

The ```UniqueID``` is something like the KAUST login ID. It is used for automatically linking the home directory. The relevant files are:

- ```/People/<UniqueID>```: directory containing the home page and all related files
- ```/People/<UniqueID>/index.{html,md}```: start page for the home page in HTML or markdown format
- ```/People/<UniqueID>/published```: if this file exists, the the home page is published by generating a link from the group page


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

At least ```authors```, ```title```, ```venue```, and ```year``` must be present for a publication to show up in a publication list. **Note:** any data value (e.g. title or url) containing a colon (':') must be enclosed in double quotes.

Note that that the strings in the author list must match exactly the ```pubname``` entries in the people database (see above). However, it is possible to add an asterisk ```*``` to the end of the name (without space!) to indicate joint first authorship.

The ```UniqueID``` is a unique identifier for each paper (Something like ```<Author><year><project acronym>```) that is used to automatically create links to thumbnail images and PDFs if the following files exist:

- ```/Publications/<UniqueID>/thumb.jpg```: thumbnail image
- ```/Publications/<UniqueID>/<UniqueID>.pdf```: PDF of the article
- ```/Publications/<UniqueID>/published```: project page linked to ```<UniqueID>/index.html```


Each publication may have additional fields (e.g. ```volume```, ```number``` etc.). These are currently ignored but may be used in the future for purposes like automatic generation of BibTeX entries. 


### To Do:

- Projects:
  - directory structure for projects
  - template for projects
  - way to highlight projects, not just pubs?
  - automatic bibtex generation?
- General:
  - main spinner: project photos
  - image spinner for a bunch of the group pages
  - image backgrounds (?), possibly some vintage optics and computing images
  - group logo?
  - news items in side bar

