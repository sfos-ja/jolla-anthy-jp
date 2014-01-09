
var trie_built = false
var hiragana_trie = {}


/*
 * Mapping between wāpuro rōmaji and hiragana
 * 'a': 'あ'  replaces 'a' with 'あ'
 * 'nk': ['ん', 'k'] replaces 'nk' with 'ん' and adds 'k' for further parsing (e.g. nka → んka → んか)
 */
var hiragana_map = {
    '-': 'ー', '~': '〜', '.': '。', ',': '、', '[': '「', ']': '」',
    'z/': '・', 'z.': '…', 'z,': '‥', 'zh': '←', 'zj': '↓', 'zk': '↑', 'zl': '→', 'z-': '〜', 'z[': '『', 'z]': '』',
    'va': 'ゔぁ', 'vi': 'ゔぃ', 'vu': 'ゔ', 've': 'ゔぇ', 'vo': 'ゔぉ', 'vya': 'ゔゃ', 'vyi': 'ゔぃ', 'vyu': 'ゔゅ', 'vye': 'ゔぇ', 'vyo': 'ゔょ',
    'qq': ['っ', 'q'], 'vv': ['っ', 'v'], 'll': ['っ', 'l'], 'xx': ['っ', 'x'], 'kk': ['っ', 'k'],
    'gg': ['っ', 'g'], 'ss': ['っ', 's'], 'zz': ['っ', 'z'], 'jj': ['っ', 'j'], 'tt': ['っ', 't'],
    'dd': ['っ', 'd'], 'hh': ['っ', 'h'], 'ff': ['っ', 'f'], 'bb': ['っ', 'b'], 'pp': ['っ', 'p'],
    'mm': ['っ', 'm'], 'yy': ['っ', 'y'], 'rr': ['っ', 'r'], 'ww': ['っ', 'w'], 'cc': ['っ', 'c'],
    'nb': ['ん', 'b'], 'nc': ['ん', 'c'], 'nd': ['ん', 'd'], 'nf': ['ん', 'f'], 'ng': ['ん', 'g'],
    'nh': ['ん', 'h'], 'nj': ['ん', 'j'], 'nk': ['ん', 'k'], 'nl': ['ん', 'l'], 'nm': ['ん', 'm'],
    'np': ['ん', 'p'], 'nq': ['ん', 'q'], 'nr': ['ん', 'r'], 'ns': ['ん', 's'], 'nt': ['ん', 't'],
    'nv': ['ん', 'v'], 'nw': ['ん', 'w'], 'nx': ['ん', 'x'], 'nz': ['ん', 'z'],
    'kya': 'きゃ', 'kyi': 'きぃ', 'kyu': 'きゅ', 'kye': 'きぇ', 'kyo': 'きょ',
    'gya': 'ぎゃ', 'gyi': 'ぎぃ', 'gyu': 'ぎゅ', 'gye': 'ぎぇ', 'gyo': 'ぎょ',
    'sya': 'しゃ', 'syi': 'しぃ', 'syu': 'しゅ', 'sye': 'しぇ', 'syo': 'しょ',
    'sha': 'しゃ', 'shi': 'し', 'shu': 'しゅ', 'she': 'しぇ', 'sho': 'しょ',
    'zya': 'じゃ', 'zyi': 'じぃ', 'zyu': 'じゅ', 'zye': 'じぇ', 'zyo': 'じょ',
    'tya': 'ちゃ', 'tyi': 'ちぃ', 'tyu': 'ちゅ', 'tye': 'ちぇ', 'tyo': 'ちょ',
    'cha': 'ちゃ', 'chi': 'ち', 'chu': 'ちゅ', 'che': 'ちぇ', 'cho': 'ちょ',
    'cya': 'ちゃ', 'cyi': 'ちぃ', 'cyu': 'ちゅ', 'cye': 'ちぇ', 'cyo': 'ちょ',
    'dya': 'ぢゃ', 'dyi': 'ぢぃ', 'dyu': 'ぢゅ', 'dye': 'ぢぇ', 'dyo': 'ぢょ',
    'tsa': 'つぁ', 'tsi': 'つぃ', 'tse': 'つぇ', 'tso': 'つぉ', 'tha': 'てゃ',
    'thi': 'てぃ', 't\'i': 'てぃ', 'thu': 'てゅ', 'the': 'てぇ', 'tho': 'てょ', 't\'yu': 'てゅ',
    'dha': 'でゃ', 'dhi': 'でぃ', 'd\'i': 'でぃ', 'dhu': 'でゅ', 'dhe': 'でぇ', 'dho': 'でょ', 'd\'yu': 'でゅ',
    'twa': 'とぁ', 'twi': 'とぃ', 'twu': 'とぅ', 'twe': 'とぇ', 'two': 'とぉ', 't\'u': 'とぅ',
    'dwa': 'どぁ', 'dwi': 'どぃ', 'dwu': 'どぅ', 'dwe': 'どぇ', 'dwo': 'どぉ', 'd\'u': 'どぅ',
    'nya': 'にゃ', 'nyi': 'にぃ', 'nyu': 'にゅ', 'nye': 'にぇ', 'nyo': 'にょ',
    'hya': 'ひゃ', 'hyi': 'ひぃ', 'hyu': 'ひゅ', 'hye': 'ひぇ', 'hyo': 'ひょ',
    'bya': 'びゃ', 'byi': 'びぃ', 'byu': 'びゅ', 'bye': 'びぇ', 'byo': 'びょ',
    'pya': 'ぴゃ', 'pyi': 'ぴぃ', 'pyu': 'ぴゅ', 'pye': 'ぴぇ', 'pyo': 'ぴょ',
    'fa': 'ふぁ', 'fi': 'ふぃ', 'fu': 'ふ', 'fe': 'ふぇ', 'fo': 'ふぉ', 'fya': 'ふゃ', 'fyu': 'ふゅ', 'fyo': 'ふょ',
    'hwa': 'ふぁ', 'hwi': 'ふぃ', 'hwe': 'ふぇ', 'hwo': 'ふぉ', 'hwyu': 'ふゅ',
    'mya': 'みゃ', 'myi': 'みぃ', 'myu': 'みゅ', 'mye': 'みぇ', 'myo': 'みょ',
    'rya': 'りゃ', 'ryi': 'りぃ', 'ryu': 'りゅ', 'rye': 'りぇ', 'ryo': 'りょ',
    'n\'': 'ん', 'nn': 'ん', 'xn': 'ん',
    'a': 'あ', 'i': 'い', 'u': 'う', 'wu': 'う', 'e': 'え', 'o': 'お',
    'xa': 'ぁ', 'xi': 'ぃ', 'xu': 'ぅ', 'xe': 'ぇ', 'xo': 'ぉ',
    'la': 'ぁ', 'li': 'ぃ', 'lu': 'ぅ', 'le': 'ぇ', 'lo': 'ぉ', 'lyi': 'ぃ', 'xyi': 'ぃ', 'lye': 'ぇ', 'xye': 'ぇ',
    'ye': 'いぇ',
    'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
    'xka': 'ヵ', 'xke': 'ヶ', 'lka': 'ヵ', 'lke': 'ヶ',
    'ga': 'が', 'gi': 'ぎ', 'gu': 'ぐ', 'ge': 'げ', 'go': 'ご',
    'sa': 'さ', 'si': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
    'ca': 'か', 'ci': 'し', 'cu': 'く', 'ce': 'せ', 'co': 'こ',
    'qa': 'くぁ', 'qi': 'くぃ', 'qu': 'く', 'qe': 'くぇ', 'qo': 'くぉ',
    'kwa': 'くぁ', 'kwi': 'くぃ', 'kwe': 'くぇ', 'kwo': 'くぉ',
    'gwa': 'ぐぁ',
    'za': 'ざ', 'zi': 'じ', 'zu': 'ず', 'ze': 'ぜ', 'zo': 'ぞ',
    'ja': 'じゃ', 'ji': 'じ', 'ju': 'じゅ', 'je': 'じぇ', 'jo': 'じょ', 'jya': 'じゃ', 'jyi': 'じぃ', 'jyu': 'じゅ', 'jye': 'じぇ', 'jyo': 'じょ',
    'ta': 'た', 'ti': 'ち', 'tu': 'つ', 'tsu': 'つ', 'te': 'て', 'to': 'と',
    'da': 'だ', 'di': 'ぢ', 'du': 'づ', 'de': 'で', 'do': 'ど',
    'xtu': 'っ', 'xtsu': 'っ', 'ltu': 'っ', 'ltsu': 'っ',
    'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
    'ha': 'は', 'hi': 'ひ', 'hu': 'ふ', 'fu': 'ふ', 'he': 'へ', 'ho': 'ほ',
    'ba': 'ば', 'bi': 'び', 'bu': 'ぶ', 'be': 'べ', 'bo': 'ぼ',
    'pa': 'ぱ', 'pi': 'ぴ', 'pu': 'ぷ', 'pe': 'ぺ', 'po': 'ぽ',
    'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
    'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
    'xya': 'ゃ', 'lya': 'ゃ', 'xyu': 'ゅ', 'lyu': 'ゅ', 'xyo': 'ょ', 'lyo': 'ょ',
    'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
    'xwa': 'ゎ', 'lwa': 'ゎ',
    'wyi': 'ゐ', 'wye': 'ゑ',
    'wa': 'わ', 'wi': 'うぃ', 'we': 'うぇ', 'wo': 'を', 'wha': 'うぁ', 'whi': 'うぃ', 'whu': 'う', 'whe': 'うぇ', 'who': 'うぉ'
}



function build_hiragana_trie() {
    hiragana_trie = {}
    for (var k in hiragana_map) {
        var cur = hiragana_trie
        Array.prototype.forEach.call(k, function(c) {
            if (!(c in cur)) {
                cur[c] = {}
            }
            cur = cur[c]
        })
        cur['end'] = hiragana_map[k]
    }
    
    trie_built = true
}

function parse_romaji(str) {
    var pos = 0
    var buff = []
    str = str.split('')
    
    while (pos < str.length) {
        var cur = hiragana_trie
        var end = null
        var end_i = -1
        for (var i = pos; i < str.length && str[i] in cur; i++) {
            cur = cur[str[i]]
            if ('end' in cur) {
                end = cur['end']
                end_i = i
                break
            }
        }
        if (end != null) {
            pos = end_i + 1 // skip to after current segment
            if (Array.isArray(end)) {
                // add second element to the current position in str
                Array.prototype.splice.bind(str, pos, 0).apply(null, end[1].split(''))
                buff.push(end[0])
            } else {
                buff.push(end)
            }
        } else {
            // add first character as-is if no match available and skip to next
            buff.push(str[pos])
            pos++
        }
    }
    
    return buff.join('')
}

function hiragana_to_katakana(str) {
    return str.replace(/./g, function(c) {
        var cc = c.charCodeAt()
        if (cc >= 0x3041 && cc <= 0x3094) {
            return String.fromCharCode(cc + 96)
        } else {
            return c
        }
    })
}