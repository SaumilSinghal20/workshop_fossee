import re
import sys

def run():
    path = r'c:\Users\pradi\Downloads\workshop_booking-enhanced\workshop_booking-enhanced\workshop_app\static\workshop_app\css\base.css'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # replace /* ============================================ ... ============================================ */
    content = re.sub(
        r'/\*\s*============================================.*?============================================\s*\*/',
        r'/* main styles */',
        content,
        flags=re.DOTALL
    )

    # replace /* ---- Navbar ---- */
    content = re.sub(
        r'/\*\s*----\s*(.*?)\s*----\s*\*/',
        r'/* \1 */',
        content
    )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    run()
