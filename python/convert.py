#!/usr/bin/env python
# coding: utf-8

# In[2]:


from data import data
from tex2html import Parser


# In[3]:


# Create html files
parser = Parser('../data/')

for c in data:
    parser.set_prefix(c)
    for f in data[c]:
        parser.parse('../tex/' + f)


# In[4]:


# Write topics.js
topics_js = open('../data/topics.js', 'w')

topics_js.write('const topics = {\n');
for i in parser.topics:
    topics_js.write('  "{}": "{}",\n'.format(i, parser.topics[i]));
topics_js.write('}\n');

topics_js.close()


# In[8]:


# Write examples.js
examples_js = open('../data/examples.js', 'w')

examples_js.write('const examples = [\n');
for topic in parser.examples:
    examples_js.write('  "{}",\n'.format(topic));
examples_js.write('];\n');

examples_js.close()


# In[ ]:




