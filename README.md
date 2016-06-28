#AnnoLet! Release 0

###AnnoLet! is a web annotation tool.###
* A tool to annotate Webpages.
* It has no persistence for now.

###Features ###
* Manual Tagging
* English to Hindi translation
* Conversion to IPA phonetic representation.
* All features apply on Node level

### How to set up? ###
####Setting up repository####
* To setup this repository, 
* go to terminal and execute `git clone https://github.com/SSS-Studio-development/annoletjs.git`
* Now the repo is cloned on to your local machine.

####Setting up the Code####
* To setup the JavaScript Code, download the org-file provided.
* Open Emacs24 or above and open this file.
* If you don't have org-mode check out the Emacs Setup section below.
* Tangle it to javascript file using Key sequence C-c C-v t.
* Go to directory in which org-file is saved, there you will find js file with same name as that of org-file.

### Using this tool ###
For detailed instructions [click here]: https://github.com/SSS-Studio-development/annoletjs/master/annolet_concept.org .

###Setting up org-mode in Emacs24+###
* open emacs and execute key sequence `M-x`.
* Type `list-packages` hit enter.
* In list find package `org-mode`.
* Click on it and install.
* Restart Emacs.
* To run org-mode, type `M-x org-mode` .

#####Footnotes#####
* Since the program is written in literate manner, use of Emacs is recommended.
* But pre tangled files are also available.
