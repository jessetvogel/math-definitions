#!/usr/bin/env python
# coding: utf-8

# In[1]:


from data import data
from tex2html import Parser


# In[3]:


# Create html files
parser = Parser('../data')

for c in data:
    print(c)
    parser.set_prefix(c)
    for f in data[c]:
        print(f)
        parser.parse('../tex/' + f)


# In[4]:


# Write topics.js
topics_js = open('../data/topics.js', 'w')

topics_js.write('var topics = {\n');
for i in parser.topics:
    topics_js.write('  "{}": "{}",\n'.format(i, parser.topics[i]));
topics_js.write('}\n');

topics_js.close()


# In[ ]:




