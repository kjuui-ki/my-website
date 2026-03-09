import codecs

CP1252_REVERSE = {}
for b in range(0x80, 0xA0):
    try:
        ch = bytes([b]).decode('cp1252')
        CP1252_REVERSE[ord(ch)] = b
    except Exception:
        pass

def is_mojibake_char(ch):
    code = ord(ch)
    if 0x80 <= code <= 0xFF: return True
    if code in CP1252_REVERSE: return True
    return False

def segment_to_bytes(segment):
    byte_list = []
    for ch in segment:
        code = ord(ch)
        if 0x80 <= code <= 0xFF:
            byte_list.append(code)
        elif code in CP1252_REVERSE:
            byte_list.append(CP1252_REVERSE[code])
        else:
            return None
    return bytes(byte_list)

def try_fix(segment):
    bts = segment_to_bytes(segment)
    if bts is None: return segment
    try:
        result = bts.decode('utf-8')
        # Accept if result is different (could be emoji, arrows, Arabic, etc.)
        if result != segment:
            return result
        return segment
    except UnicodeDecodeError:
        return segment

def fix_line(line):
    result = []
    i = 0
    while i < len(line):
        ch = line[i]
        if is_mojibake_char(ch):
            j = i
            while j < len(line):
                c = line[j]
                if is_mojibake_char(c):
                    j += 1
                elif c == ' ' and j + 1 < len(line) and is_mojibake_char(line[j+1]):
                    j += 1
                else:
                    break
            segment = line[i:j]
            result.append(try_fix(segment))
            i = j
        else:
            result.append(ch)
            i += 1
    return ''.join(result)

with codecs.open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')
fixed = 0
new_lines = []
for i, line in enumerate(lines):
    if any(is_mojibake_char(c) for c in line):
        new_line = fix_line(line)
        if new_line != line:
            fixed += 1
        new_lines.append(new_line)
    else:
        new_lines.append(line)

new_content = '\n'.join(new_lines)
with codecs.open('script.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Fixed:', fixed, '/ Total:', len(lines))