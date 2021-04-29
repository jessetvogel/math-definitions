#!/usr/bin/env python
# coding: utf-8

# In[1]:


import os
from tex2html import Parser


# In[2]:


# Create html files
parser = Parser('../data/')

# Search .tex files inside the two-lettered category-directories
tex_path = '../tex/'
categories = sorted([ f for f in os.listdir(tex_path) if os.path.isdir(os.path.join(tex_path, f)) ])
for cat in categories:
    cat_path = os.path.join(tex_path, cat)
    parser.set_prefix(cat)
    for f in os.listdir(cat_path):
        file_path = os.path.join(cat_path, f)
        file_extension = os.path.splitext(file_path)[1]
        if '--' in file_path or file_extension != '.tex' or not os.path.isfile(file_path):
            continue
            
        parser.parse(file_path)


# In[3]:


# Write topics.js
topics_js = open('../data/topics.js', 'w')

topics_js.write('const topics = {\n')
for i in parser.topics:
    topics_js.write('  "{}": "{}",\n'.format(i, parser.topics[i]));
topics_js.write('}\n')

topics_js.close()


# In[4]:


# Write examples.js
examples_js = open('../data/examples.js', 'w')

examples_js.write('const examples = [\n')
for topic in parser.examples:
    examples_js.write('  "{}",\n'.format(topic))
examples_js.write('];\n')

examples_js.close()


# In[5]:


# Print stats
print('\nCompiled {} topics'.format(len(parser.topics)))


# In[ ]:




