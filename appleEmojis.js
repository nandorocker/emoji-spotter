const emojiList = {
  smileys: [
    "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", 
    "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", 
    "😋", "😛", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", 
    "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", 
    "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", 
    "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", 
    "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", 
    "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", 
    "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", 
    "👹", "👺", "🤡", "💩", "👻", "💀", "☠️", "👽", "👾", "🤖", 
    "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"
  ],
  people: [
    "👶", "🧒", "👦", "👧", "🧑", "👱", "👨", "🧔", "👩", "🧓", 
    "👴", "👵", "🙍", "🙎", "🙅", "🙆", "💁", "🙋", "🧏", "🤦", 
    "🤷", "👤", "👥", "🫂", "👪", "👨‍👩‍👧", "👨‍👩‍👧‍👦", "👨‍👩‍👦‍👦", "👨‍👩‍👧‍👧", 
    "👩‍👩‍👦", "👨‍👨‍👧", "👫", "👬", "👭", "👩‍❤️‍👨", "👨‍❤️‍👨", "👩‍❤️‍👩", 
    "💏", "👩‍❤️‍💋‍👨", "👨‍❤️‍💋‍👨", "👩‍❤️‍💋‍👩", "👰", "🤵", "👸", "🤴", 
    "🦸", "🦹", "🤱", "👩‍🍼", "👨‍🍼", "🧑‍🍼", "🤰", "🤳"
  ],
  animalsAndNature: [
    "🐵", "🐒", "🦍", "🦧", "🐶", "🐕", "🦮", "🐕‍🦺", "🐩", "🐺", 
    "🦊", "🦝", "🐱", "🐈", "🐈‍⬛", "🦁", "🐯", "🐅", "🐆", "🐴", 
    "🐎", "🦄", "🦓", "🦌", "🐮", "🐂", "🐃", "🐄", "🐷", "🐖", 
    "🐗", "🐽", "🐏", "🐑", "🐐", "🐪", "🐫", "🦙", "🦘", "🦌", 
    "🐘", "🦏", "🦛", "🐭", "🐀", "🐹", "🐰", "🐇", "🐿️", "🦨", 
    "🦔", "🦦", "🦫", "🦝", "🐻", "🐨", "🐼", "🦥", "🦡", "🐾", 
    "🦃", "🐓", "🐔", "🐣", "🐤", "🐥", "🐦", "🐧", "🕊️", "🦤", 
    "🦢", "🦩", "🦚", "🦜", "🐦", "🐤", "🐣", "🐥", "🦉", "🦤", 
    "🐸", "🐊", "🐢", "🦎", "🐍", "🐲", "🐉", "🦕", "🦖", "🐳", 
    "🐋", "🐬", "🦭", "🐟", "🐠", "🐡", "🦈", "🐙", "🐚", "🐌", 
    "🦋", "🐛", "🐜", "🐝", "🪲", "🐞", "🦗", "🪳", "🕷️", "🕸️", 
    "🦂", "🦟", "🪰", "🪱", "🦠"
  ],
  foodAndDrink: [
    "🍇", "🍈", "🍉", "🍊", "🍋", "🍌", "🍍", "🥭", "🍎", "🍏", 
    "🍐", "🍑", "🍒", "🍓", "🥝", "🍅", "🥥", "🥑", "🍆", "🥔", 
    "🥕", "🌽", "🌶️", "🫑", "🥒", "🥬", "🥦", "🧄", "🧅", "🍄", 
    "🥜", "🌰", "🍞", "🥐", "🥖", "🫓", "🥨", "🥯", "🥞", "🧇", 
    "🧀", "🍖", "🍗", "🥩", "🥓", "🍔", "🍟", "🍕", "🌭", "🥪", 
    "🌮", "🌯", "🫔", "🥙", "🧆", "🥚", "🍳", "🥘", "🍲", "🫕", 
    "🥗", "🍿", "🧈", "🧂", "🥫", "🍱", "🍘", "🍙", "🍚", "🍛", 
    "🍜", "🍝", "🍠", "🍢", "🍣", "🍤", "🍥", "🥮", "🍡", "🥟", 
    "🥠", "🥡", "🦪", "🍦", "🍧", "🍨", "🍩", "🍪", "🎂", "🍰", 
    "🧁", "🥧", "🍫", "🍬", "🍭", "🍮", "🍯", "🍼", "🥛", "☕", 
    "🍵", "🍶", "🍾", "🍷", "🍸", "🍹", "🍺", "🍻", "🥂", "🥃", 
    "🥤", "🧃", "🧁", "🧊"
  ],
  activity: [
    "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", 
    "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳", 
    "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛼", "🤼", 
    "🤼‍♀️", "🤼‍♂️", "🤸", "🤸‍♀️", "🤸‍♂️", "⛷️", "🏂", "🪂", "🏋️", 
    "🏋️‍♀️", "🏋️‍♂️", "🤺", "🤾", "🤾‍♀️", "🤾‍♂️", "🏌️", "🏌️‍♀️", 
    "🏌️‍♂️", "🏇", "🧘", "🧘‍♀️", "🧘‍♂️", "🏄", "🏄‍♀️", "🏄‍♂️", "🚣", 
    "🚣‍♀️", "🚣‍♂️", "🏊", "🏊‍♀️", "🏊‍♂️", "⛹️", "⛹️‍♀️", "⛹️‍♂️", 
    "🏋️", "🤹", "🤹‍♀️", "🤹‍♂️", "🎪", "🎭", "🩰", "🎨", "🎮", 
    "🎲", "🧩"
  ],
  travelAndPlaces: [
    "🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", 
    "🚚", "🚛", "🚜", "🦯", "🦽", "🦼", "🚲", "🛵", "🏍️", "🛺", 
    "🚨", "🚥", "🚦", "🚧", "🛑", "🚢", "⛴️", "🛳️", "🚤", "🛥️", 
    "🛶", "⛵", "🚉", "🚊", "🚝", "🚞", "🚋", "🚌", "🚍", "🚎", 
    "🚐", "🚑", "🚒", "🚓", "🚔", "🚘", "✈️", "🛩️", "🛫", "🛬", 
    "🪂", "💺", "🚁", "🚟", "🚠", "🚡", "🛰️", "🚀", "🛸", "🛎️", 
    "🧳", "⌛", "⏳", "⌚", "⏰", "⏱️", "⏲️", "🕰️", "🌡️", "🌎", 
    "🌍", "🌏", "🌐", "🗺️", "🏔️", "⛰️", "🌋", "🗻", "🏕️", "🏖️", 
    "🏜️", "🏝️", "🏞️", "🏟️", "🏛️", "🏗️", "🧱", "🪨", "🪵", "🏘️", 
    "🏚️", "🏠", "🏡", "🏢", "🏣", "🏤", "🏥", "🏦", "🏨", "🏩", 
    "🏪", "🏫", "🏬", "🏭", "🏯", "🏰", "💒", "🗼", "🗽", "⛪", 
    "🕌", "🛕", "🕍", "⛩️", "🕋", "⛲", "⛺", "🌁", "🌃", "🏙️", 
    "🌄", "🌅", "🌆", "🌇", "🌉", "♨️", "🎠", "🎡", "🎢", "💈", 
    "🎪"
  ],
  objects: [
    "⌛", "⏳", "⌚", "⏰", "⏱️", "⏲️", "🕰️", "🌡️", "🧭", "🎲", 
    "🧮", "🀄", "🎴", "🃏", "🆔", "🚻", "🚹", "🚺", "🚼", "🚾", 
    "🛂", "🛃", "🛄", "🛅", "⚠️", "🚸", "⛔", "🚫", "🚳", "🚭", 
    "🚯", "🚱", "🚷", "📵", "🔞", "☢️", "☣️", "⬆️", "↗️", "➡️", 
    "↘️", "⬇️", "↙️", "⬅️", "↖️", "↕️", "↔️", "↩️", "↪️", "⤴️", 
    "⤵️", "🔃", "🔄", "🔀", "🔁", "🔂", "🔄", "🔃", "🔊", "🔉", 
    "🔈", "🔇", "📣", "📢", "🔔", "🔕", "🃏", "🀄", "♠️", "♥️", 
    "♦️", "♣️", "🎴", "💡", "🔦", "🏮", "🧱", "🪔", "🧶", "🧵", 
    "🧷", "🧹", "🧺", "🧻", "🪣", "🧼", "🪥", "🧽", "🧯", "🛒", 
    "🚽", "🚿", "🛁", "🪒", "🧴", "🧷", "🧹", "🧺", "🧻", "🪣", 
    "🧼", "🪥", "🧽", "🧯", "🛢️", "🧲", "🧨", "💊", "💉", "🩹", 
    "🩺", "🚨", "🛃", "🧬", "🦠", "💉", "🩺"
  ],
  symbols: [
    "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", 
    "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️", 
    "✝️", "☪️", "🕉️", "☸️", "✡️", "🔯", "🤝", "☯️", "☦️", "🛐", 
    "⛎", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", 
    "♒", "♓", "🆔", "🈲", "🈹", "🈺", "🈶", "🈚", "🈸", "🈴", 
    "🈳", "🈯", "💹", "❎", "✅", "💠", "🔘", "🔲", "🔳", "⭕", 
    "⚫", "⚪", "🟤", "🟣", "🟢", "🟡", "🟠", "🔴", "🔵", "🟥", 
    "🟧", "🟨", "🟩", "🟦", "🟪", "🟫", "◼️", "◻️", "◽", "◾", 
    "▫️", "▪️", "🔶", "🔷", "🔸", "🔹", "🔺", "🔻", "💢", "♦️", 
    "♠️", "♣️", "♥️", "✴️", "✳️", "❇️", "❗", "❓", "❕", "❔", 
    "‼️", "⁉️", "💯", "🔅", "🔆", "🔱", "⚜️", "📛", "🅰️", "🆎", 
    "🅱️", "🆑", "🆒", "🆓", "🆔", "🆕", "🆖", "🈁", "🈂️", "🈷️", 
    "🈶", "🈯", "🉐", "🈹", "🈚", "🈲", "🉑", "🈸", "🈴", "🈳", 
    "㊗️", "㊙️", "🈁", "🈂️", "🈷️", "🈶", "🈯", "🉐", "🈹", "🈚", 
    "🈲", "🉑", "🈸", "🈴", "🈳", "㊗️", "㊙️"
  ],
  flags: [
    "🏁", "🚩", "🏴", "🏳️", "🏴‍☠️", "🇦🇨", "🇦🇩", "🇦🇪", "🇦🇫", "🇦🇬", 
    "🇦🇮", "🇦🇱", "🇦🇲", "🇦🇴", "🇦🇶", "🇦🇷", "🇦🇸", "🇦🇹", "🇦🇺", "🇦🇼", 
    "🇦🇽", "🇦🇿", "🇧🇦", "🇧🇧", "🇧🇩", "🇧🇪", "🇧🇫", "🇧🇬", "🇧🇭", "🇧🇮", 
    "🇧🇯", "🇧🇱", "🇧🇲", "🇧🇳", "🇧🇴", "🇧🇶", "🇧🇷", "🇧🇸", "🇧🇹", "🇧🇻", 
    "🇧🇼", "🇧🇾", "🇧🇿", "🇨🇦", "🇨🇨", "🇨🇩", "🇨🇫", "🇨🇬", "🇨🇭", "🇨🇮", 
    "🇨🇰", "🇨🇱", "🇨🇲", "🇨🇳", "🇨🇴", "🇨🇵", "🇨🇷", "🇨🇺", "🇨🇻", "🇨🇼", 
    "🇨🇽", "🇨🇾", "🇨🇿", "🇩🇪", "🇩🇬", "🇩🇯", "🇩🇰", "🇩🇲", "🇩🇴", "🇩🇿", 
    "🇪🇦", "🇪🇨", "🇪🇪", "🇪🇬", "🇪🇭", "🇪🇷", "🇪🇸", "🇪🇹", "🇪🇺", "🇫🇮", 
    "🇫🇯", "🇫🇰", "🇫🇲", "🇫🇴", "🇫🇷", "🇬🇦", "🇬🇧", "🇬🇩", "🇬🇪", "🇬🇫", 
    "🇬🇬", "🇬🇭", "🇬🇮", "🇬🇱", "🇬🇲", "🇬🇳", "🇬🇵", "🇬🇶", "🇬🇷", "🇬🇸", 
    "🇬🇹", "🇬🇺", "🇬🇼", "🇬🇾", "🇭🇰", "🇭🇲", "🇭🇳", "🇭🇷", "🇭🇹", "🇭🇺", 
    "🇮🇨", "🇮🇩", "🇮🇪", "🇮🇱", "🇮🇲", "🇮🇳", "🇮🇴", "🇮🇶", "🇮🇷", "🇮🇸", 
    "🇮🇹", "🇯🇪", "🇯🇲", "🇯🇴", "🇯🇵", "🇰🇪", "🇰🇬", "🇰🇭", "🇰🇮", "🇰🇲", 
    "🇰🇳", "🇰🇵", "🇰🇷", "🇰🇼", "🇰🇾", "🇰🇿", "🇱🇦", "🇱🇧", "🇱🇨", "🇱🇮", 
    "🇱🇰", "🇱🇷", "🇱🇸", "🇱🇹", "🇱🇺", "🇱🇻", "🇱🇾", "🇲🇦", "🇲🇨", "🇲🇩", 
    "🇲🇪", "🇲🇫", "🇲🇬", "🇲🇭", "🇲🇰", "🇲🇱", "🇲🇲", "🇲🇳", "🇲🇴", "🇲🇵", 
    "🇲🇶", "🇲🇷", "🇲🇸", "🇲🇹", "🇲🇺", "🇲🇻", "🇲🇼", "🇲🇽", "🇲🇾", "🇲🇿", 
    "🇳🇦", "🇳🇨", "🇳🇪", "🇳🇫", "🇳🇬", "🇳🇮", "🇳🇱", "🇳🇴", "🇳🇵", "🇳🇷", 
    "🇳🇺", "🇳🇿", "🇴🇲", "🇵🇦", "🇵🇪", "🇵🇫", "🇵🇬", "🇵🇭", "🇵🇰", "🇵🇱", 
    "🇵🇲", "🇵🇳", "🇵🇷", "🇵🇸", "🇵🇹", "🇵🇼", "🇵🇾", "🇶🇦", "🇷🇪", "🇷🇴", 
    "🇷🇸", "🇷🇺", "🇷🇼", "🇸🇦", "🇸🇧", "🇸🇨", "🇸🇩", "🇸🇪", "🇸🇬", "🇸🇭", 
    "🇸🇮", "🇸🇯", "🇸🇰", "🇸🇱", "🇸🇲", "🇸🇳", "🇸🇴", "🇸🇷", "🇸🇸", "🇸🇹", 
    "🇸🇻", "🇸🇽", "🇸🇾", "🇸🇿", "🇹🇦", "🇹🇨", "🇹🇩", "🇹🇫", "🇹🇬", "🇹🇭", 
    "🇹🇯", "🇹🇰", "🇹🇱", "🇹🇲", "🇹🇳", "🇹🇴", "🇹🇷", "🇹🇹", "🇹🇻", "🇹🇼", 
    "🇹🇿", "🇺🇦", "🇺🇬", "🇺🇲", "🇺🇳", "🇺🇸", "🇺🇾", "🇺🇿", "🇻🇦", "🇻🇨", 
    "🇻🇪", "🇻🇬", "🇻🇮", "🇻🇳", "🇻🇺", "🇼🇫", "🇼🇸", "🇽🇰", "🇾🇪", "🇾🇹", 
    "🇿🇦", "🇿🇲", "🇿🇼", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "🏴󠁧󠁢󠁷󠁬󠁳󠁿"
  ]
};