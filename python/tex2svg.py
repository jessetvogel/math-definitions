#!/usr/bin/env python
# coding: utf-8

# In[1]:


import os
import subprocess
import shutil


# In[6]:


def tex2svg(tex_file, svg_dest):
    # Paths and filenames
    build_dir, filename = os.path.split(tex_file)
    base, ext = os.path.splitext(filename)
    if ext != '.tex':
        raise Exception('input must be a .tex file')
    
    # Run `pdflatex`
    args = ('pdflatex', '-halt-on-error', '-interaction=nonstopmode', '-output-directory=' + build_dir, filename)
    code = subprocess.run(args).returncode
    if code != 0:
        raise Exception('failed to compile to pdf')
    
    # Run `pdf2svg`
    svg_file = build_dir + '/' + base + '.svg'
    pdf_file = build_dir + '/' + base + '.pdf'
    args = ('pdf2svg', pdf_file, svg_file)
    code = subprocess.run(args, stdout = subprocess.DEVNULL, stderr = subprocess.DEVNULL).returncode
    if code != 0:
        raise Exception('failed to convert pdf to svg')
        
    shutil.copyfile(svg_file, svg_dest)
    return True
