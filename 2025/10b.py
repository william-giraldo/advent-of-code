import re
import scipy

def parse_line(line: str):
    paren_arrays = []
    for group in re.findall(r'\(([^)]*)\)', line):
        if group.strip():
            nums = [int(x) for x in group.split(',')]
            paren_arrays.append(nums)
    
    inner = re.search(r'\{([^}]*)\}', line).group(1).strip()
    bracket_array = [int(x) for x in inner.split(',')]

    return paren_arrays, bracket_array

def transpose(matrix):
    return [list(row) for row in zip(*matrix)]

if __name__ == "__main__":
    filename = "input.txt"

    sum = 0
    with open(filename, "r") as f:
        for line_number, line in enumerate(f, 1):
            buttons, goal = parse_line(line)
            L = len(goal)
            vecs = []
            for button in buttons:
                target = [0]*L
                for i in button:
                    target[i] = 1
                vecs.append(target)
            
            z = scipy.optimize.linprog([1]*len(buttons), None, None, transpose(vecs), goal, integrality=[1]*len(buttons))
            # print(z.x)
            for v in z.x:
                sum += v
    print(sum)