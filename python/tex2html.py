#!/usr/bin/env python
# coding: utf-8

# In[1]:


import re
import os
import hashlib
from tex2svg import tex2svg


# In[2]:


class Scanner():
    
    def __init__(self, file):
        self.file = file
        self.line = 1
        self.position = 0
        
    def get(self):
        c = self.file.read(1)
        if c:
            if c == '\n':
                self.line += 1
                self.position = 0
            else:
                self.position += 1
        return c


# In[3]:


class Token:

    T_TEXT = 0
    T_COMMAND = 1
    T_SEPARATOR = 2
    T_WHITESPACE = 3
    T_NEWLINE = 4
    T_EOF = 5
    
    def __init__(self, T, line, position, data = ''):
        self.type = T
        self.line = line
        self.position = position
        self.data = data


# In[4]:


class Lexer():
    
    def __init__(self, scanner):
        self.scanner = scanner
        self.current_token = None
        self.tmp = ''
        self.tmp_line = 0
        self.tmp_position = 0
        
    def tokenize(self, expr):
        if expr in ['{', '}', '\\[', '\\]', '$', '\\&', '\\#', '\\\\', '\\{', '\\}', '\\;', '[', ']']:
            return Token(Token.T_SEPARATOR, self.tmp_line, self.tmp_position, expr)
        
        if re.match(r'\A\\\w+\Z', expr):
            return Token(Token.T_COMMAND, self.tmp_line, self.tmp_position, expr)

        if re.match(r'\n\Z', expr):
            return Token(Token.T_NEWLINE, self.tmp_line, self.tmp_position, expr)
        
        if re.match(r'\A[^\S\n]+\Z', expr):
            return Token(Token.T_WHITESPACE, self.tmp_line, self.tmp_position, expr)
        
        if re.match(r'\A[^{}\\\[\]$\s][^{}\\\[\]$\n]*\Z', expr):
            return Token(Token.T_TEXT, self.tmp_line, self.tmp_position, expr)

        return None
        
    def get_token(self):
        # Read characters until a new Token is produced
        while True:
            c = self.scanner.get()

            # End of file
            if not c:
                if self.tmp == '':
                    return Token(Token.T_EOF, -1, -1, '')
                    
                token = self.tokenize(self.tmp)
                if not token:
                    raise Exception('Unexpected token \'{}\''.format(self.tmp))
                self.current_token = None
                self.tmp = ''
                return token
            
            
            # Comments: marks the end of a token (if there currently is one),
            # then continue discarding characters until a newline appears
            if c in ['%']:
                token = None
                
                if self.tmp != '':
                    if not self.current_token:
                        raise Exception('Unknown token \'{}\''.format(self.tmp))
                    token = self.current_token
                
                while self.scanner.get() != '\n':
                    pass
                
                self.tmp = '' # LaTeX will then omit the newline
                self.tmp_line = self.scanner.line
                self.tmp_position = self.scanner.position
                self.current_token = self.tokenize(self.tmp)
                
                return token if token else self.get_token()
            
            # Try to enlarge the token if possible
            token = self.tokenize(self.tmp + c)
            if token:
                self.current_token = token
                if self.tmp == '':
                    self.tmp_line = self.scanner.line
                    self.tmp_position = self.scanner.position
                self.tmp += c
                continue

            # If we also did not succeed before, hope that it will make sense later
            if not self.current_token:
                self.tmp += c
                continue

            # Return the last valid token
            token = self.current_token
            self.tmp = c
            self.tmp_line = self.scanner.line
            self.tmp_position = self.scanner.position
            self.current_token = self.tokenize(self.tmp)
            return token


# In[1]:


class Parser:
    
    def __init__(self, output_dir):
        self.output_dir = output_dir
        self.current_token = None
        self.prefix = ''
        self.topics = {}
        self.examples = {}
    
    def set_prefix(self, prefix):
        self.prefix = prefix
    
    def get_topics(self):
        return self.topics
    
    def next_token(self):
        self.current_token = self.lexer.get_token()
            
    def found(self, token_type = None, data = None):
        if self.current_token == None:
            self.next_token()
        return token_type == None or (self.current_token.type == token_type and (data == None or data == self.current_token.data))
        
    def consume(self, token_type = None, data = None):            
        if self.found(token_type, data):
            token = self.current_token
            self.current_token = None
            return token
        else:
            raise Exception('Expected \'{}\' but found \'{}\' [{}] (at line {} position {})'.format(data, self.current_token.data, self.current_token.type, self.current_token.line, self.current_token.position))
    
    def omit_whitespace(self, omit_newlines = True):
        while self.found(Token.T_WHITESPACE) or (omit_newlines and self.found(Token.T_NEWLINE)):
            self.consume()
    
    def parse(self, tex_file):        
        # Create Scanner & Lexer
        self.scanner = Scanner(open(tex_file, 'r'))
        self.lexer = Lexer(self.scanner)
        self.current_token = None
        
        # Keep parsing topics until end of file (ignoring newlines)
        self.omit_whitespace()
        while not self.found(Token.T_EOF):
            self.parse_topic_or_example()
            self.omit_whitespace()
    
    def parse_topic_or_example(self):
        # \begin{topic|example} ...
        self.consume(Token.T_COMMAND, '\\begin')
        self.consume(Token.T_SEPARATOR, '{')
        environment = self.consume(Token.T_TEXT).data
        
        if environment == 'topic':
            self.parse_topic()
            
        elif environment == 'example':
            self.parse_example()
            
        else:
            raise Exception('Expected topic or example, but found ' + environment)

    def parse_topic(self):
        # \begin{topic}{identifier}{name} ... \end{topic}
#         self.consume(Token.T_COMMAND, '\\begin')
#         self.consume(Token.T_SEPARATOR, '{')
#         self.consume(Token.T_TEXT, 'topic')
        self.consume(Token.T_SEPARATOR, '}')
        self.consume(Token.T_SEPARATOR, '{')
        suffix = self.consume(Token.T_TEXT).data
        self.consume(Token.T_SEPARATOR, '}')
        self.consume(Token.T_SEPARATOR, '{')
        name = self.consume(Token.T_TEXT).data
        self.consume(Token.T_SEPARATOR, '}')
        
        identifier = self.prefix + ':' + suffix
        if identifier in self.topics:
            raise Exception('Identifier ' + identifier + ' already used')
        
        print('{} [{}]'.format(name, identifier))
        self.topics[identifier] = name
        
        self.output = open(self.output_dir + '/definitions/' + self.prefix + '-' + suffix + '.html', 'w')
        self.omit_whitespace()
        self.parse_environment('topic')
        self.output.close()
        
    def parse_example(self):
        # \begin{example}{topic} ... \end{example}
#         self.consume(Token.T_COMMAND, '\\begin')
#         self.consume(Token.T_SEPARATOR, '{')
#         self.consume(Token.T_TEXT, 'topic')
        self.consume(Token.T_SEPARATOR, '}')
        self.consume(Token.T_SEPARATOR, '{')
        topic = self.prefix + ':' + self.consume(Token.T_TEXT).data
        self.consume(Token.T_SEPARATOR, '}')
        
        if topic not in self.topics:
            raise Exception('Topic ' + topic + ' does not exist')
        
        print('Example {}'.format(topic))
        
        if topic in self.examples:
            self.examples[topic] += 1
        else:
            self.examples[topic] = 1
        
        self.output = open(self.output_dir + '/examples/' + topic + '-' + str(self.examples[topic]) + '.html', 'w')
        self.omit_whitespace()
        self.parse_environment('example')
        self.output.close()
    
    def parse_begin_environment(self):
        self.consume(Token.T_COMMAND, '\\begin')
        self.consume(Token.T_SEPARATOR, '{')
        env = self.consume(Token.T_TEXT).data
        self.consume(Token.T_SEPARATOR, '}')
        args = []
        while self.found(Token.T_SEPARATOR, '{'):
            self.consume()
            args.append(self.consume(Token.T_TEXT).data)
            self.consume(Token.T_SEPARATOR, '}')
        
        self.parse_environment(env, args)
    
    def parse_environment(self, env, args = []):        
        if env == 'enumerate':
            item_type = '1'
            if self.found(Token.T_SEPARATOR, '['): # Read item type if specified
                self.consume()
                item_type = self.consume(Token.T_TEXT).data
                self.consume(Token.T_SEPARATOR, ']')

            self.omit_whitespace()    
            self.parse_environment_list(True, item_type)
        elif env == 'itemize':
            self.omit_whitespace()
            self.parse_environment_list(False)
        else:
            self.parse_content()
            
        self.omit_whitespace() # This one is probably unnecessary..

        self.consume(Token.T_COMMAND, '\\end')
        self.consume(Token.T_SEPARATOR, '{')
        self.consume(Token.T_TEXT, env)
        self.consume(Token.T_SEPARATOR, '}')
            
    def parse_environment_list(self, ordered, item_type = '1'):
        self.output.write('<ol type="{}">'.format(item_type) if ordered else '<ul>')
        
        first_item = True
        while self.found(Token.T_COMMAND, '\\item'):
            self.consume()
            self.output.write('<li>' if first_item else '</li><li>')
            first_item = False
            self.parse_content()
                
        if not first_item:
            self.output.write('</li>')
        self.output.write('</ol>' if ordered else '</ul>')    
            
    def parse_content(self):
        while True:
            if self.found(Token.T_TEXT) or self.found(Token.T_WHITESPACE):
                token = self.consume()
                self.output.write(self.special_chars(token.data))
                continue
            
            if self.found(Token.T_NEWLINE):
                self.consume()
                self.omit_whitespace(omit_newlines = False)
                if self.found(Token.T_NEWLINE):
                    self.omit_whitespace()
                    self.output.write('<br/>')
                self.output.write('\n')
                continue
            
            if self.found(Token.T_SEPARATOR, '$'):
                self.parse_inline_math()
                continue

            if self.found(Token.T_SEPARATOR, '\\['):
                self.parse_display_math()
                continue

            if self.found(Token.T_COMMAND, '\\textbf'):
                self.parse_textbf()
                continue

            if self.found(Token.T_COMMAND, '\\textit'):
                self.parse_textit()
                continue
                
            if self.found(Token.T_COMMAND, '\\tref'):
                self.parse_tref()
                continue
                
            if self.found(Token.T_COMMAND, '\\begin'):
                self.parse_begin_environment()
                continue
                
            break
        
    def parse_inline_math(self):
        self.consume(Token.T_SEPARATOR, '$')
        s = ''
        while not self.found(Token.T_SEPARATOR, '$'):
            s += self.consume().data
        self.consume()
        self.output.write('<span class="math inline">\\(' + s + '\\)</span>')
    
    def parse_display_math(self):
        self.consume(Token.T_SEPARATOR, '\\[')
        s = ''
        while not self.found(Token.T_SEPARATOR, '\\]'):
            s += self.consume().data
        self.consume()
        
        if 'tikzcd' not in s:
            self.output.write('<span class="math display">\\[' + s + '\\]</span>')
        else:
            svg = self.math_to_svg(s)
            if svg == False:
                raise Exception('failed to compile display math')
            self.output.write('<img class="display-math-svg" src="data/{}" alt />'.format(svg))
        
    def parse_textbf(self):
        self.consume(Token.T_COMMAND, '\\textbf')
        self.consume(Token.T_SEPARATOR, '{')
        self.output.write('<b>')
        self.parse_content()
        self.consume(Token.T_SEPARATOR, '}')
        self.output.write('</b>')
        
    def parse_textit(self):
        self.consume(Token.T_COMMAND, '\\textit')
        self.consume(Token.T_SEPARATOR, '{')
        self.output.write('<i>')
        self.parse_content()
        self.consume(Token.T_SEPARATOR, '}')
        self.output.write('</i>')
        
    def parse_tref(self):
        self.consume(Token.T_COMMAND, '\\tref')
        self.consume(Token.T_SEPARATOR, '{')
        identifier = self.consume(Token.T_TEXT).data
        identifier = identifier if ':' in identifier else self.prefix + ':' + identifier
        self.consume(Token.T_SEPARATOR, '}')
        self.consume(Token.T_SEPARATOR, '{')
        self.output.write('<a href="javascript:gotoTopic(\'{}\');">'.format(identifier))
        self.parse_content()
        self.output.write('</a>')
        self.consume(Token.T_SEPARATOR, '}')
    
    def special_chars(self, s):
        if '`' in s:
            s = s.replace('`', '&lsquo;')
        if '\'' in s:
            s = s.replace('\'', '&rsquo;')
        return s
    
    def math_to_svg(self, tex):
        # See if the svg has been created before
        tex_hash = hashlib.sha1(tex.encode()).hexdigest()
        svg_file_relative = 'svg/' + tex_hash + '.svg'
        svg_file = self.output_dir + '/' + svg_file_relative
        if os.path.isfile(svg_file):
            return svg_file_relative

        # Create tmp directory if not exists
        tmp_dir = self.output_dir + '/svg/_tmp_'
        if not os.path.isdir(tmp_dir):
            os.mkdir(tmp_dir)

        # Create tex file
        f = open(tmp_dir + '/math.tex', 'w')
        f.writelines([
            '\\documentclass{standalone}\n',
            '\\usepackage{tikz-cd}\n',
            '\\newcommand{\\Hom}{\\textup{Hom}}\n',
            '\\newcommand{\\bdot}{\\bullet}\n',
            '\\begin{document}\n',
            '$\\displaystyle ' + tex + '$\n',
            '\\end{document}\n'
        ])
        f.close()

        # Create svg
        try:
            tex2svg(tmp_dir + '/math.tex', svg_file)
            return svg_file_relative
        except:
            return False


# In[6]:


# parser = Parser('/Users/jessevogel/Projects/math-definitions/data/')
# parser.set_prefix('AG')
# parser.parse('/Users/jessevogel/Projects/math-definitions/tex/sheaves.tex')


# In[ ]:




