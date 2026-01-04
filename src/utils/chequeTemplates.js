
export const CHEQUE_TYPES = {
    CROSS: 'CROSS',
    BEARER: 'BEARER',
}

export const SRI_LANKAN_BANKS = {
    SAMPATH: {
        name: 'Sampath Bank',
        code: 'SAMPATH',
        logo: '/images/cheques/seylan-cheque.jpg',
        backgroundImage: '/images/cheques/seylan-cheque.jpg',
    },
    BOC: {
        name: 'Bank of Ceylon',
        code: 'BOC',
        logo: '/images/banks/boc.png',
    },
    PEOPLES: {
        name: 'People\'s Bank',
        code: 'PEOPLES',
        logo: '/images/banks/peoples.png',
    },
    COMMERCIAL: {
        name: 'Commercial Bank',
        code: 'COMMERCIAL',
        logo: '/images/banks/commercial.png',
    },
    HNB: {
        name: 'Hatton National Bank',
        code: 'HNB',
        logo: '/images/banks/hnb.png',
    },
    DFCC: {
        name: 'DFCC Bank',
        code: 'DFCC',
        logo: '/images/banks/dfcc.png',
    },
}


export const SAMPATH_CHEQUE_POSITIONS = {
    dateBox1: { top: '45px', left: '480px', width: '22px', height: '28px' }, 
    dateBox2: { top: '45px', left: '505px', width: '22px', height: '28px' }, 
    dateBox3: { top: '45px', left: '530px', width: '22px', height: '28px' }, 
    dateBox4: { top: '45px', left: '555px', width: '22px', height: '28px' }, 
    dateBox5: { top: '45px', left: '580px', width: '22px', height: '28px' }, 
    dateBox6: { top: '45px', left: '605px', width: '22px', height: '28px' }, 
    dateBox7: { top: '45px', left: '630px', width: '22px', height: '28px' }, 
    dateBox8: { top: '45px', left: '655px', width: '22px', height: '28px' }, 

    payeeLine: { top: '95px', left: '120px', width: '320px', height: '22px' },

    amountInWordsRow1: { top: '130px', left: '120px', width: '350px', height: '22px' },
    amountInWordsRow2: { top: '154px', left: '120px', width: '350px', height: '22px' },
    amountInWordsRow3: { top: '178px', left: '120px', width: '350px', height: '22px' },

    amountInFiguresBox: { top: '95px', left: '520px', width: '140px', height: '38px' },

    signatureArea: { top: '140px', left: '520px', width: '140px', height: '50px' },

    accountNumber: { top: '210px', left: '45px', width: '200px', height: '18px' },

    accountName: { top: '230px', left: '45px', width: '250px', height: '18px' },

    crossMarkDiagonal: {
        top: '10px',
        left: '10px',
        width: '180px',
        height: '60px',
        rotation: '-38deg',
    },
    crossMarkLineTop: {
        top: '25px',
        left: '15px',
        width: '170px',
        rotation: '-38deg',
    },
    crossMarkLineBottom: {
        top: '50px',
        left: '15px',
        width: '170px',
        rotation: '-38deg',
    },
}

export const CHEQUE_DIMENSIONS = {
    screenWidth: '800px',
    screenHeight: '330px',
    printWidth: '175mm',
    printHeight: '80mm',
    aspectRatio: 175 / 80, 
}

export const splitAmountIntoRows = (amountInWords, maxCharsPerRow = 42) => {
    if (!amountInWords) return ['']

    const words = amountInWords.split(' ')
    const rows = []
    let currentRow = ''

    words.forEach(word => {
        const testRow = currentRow ? `${currentRow} ${word}` : word
        if (testRow.length <= maxCharsPerRow) {
            currentRow = testRow
        } else {
            if (currentRow) rows.push(currentRow)
            currentRow = word
        }
    })

    if (currentRow) rows.push(currentRow)

    return rows.length > 0 ? rows : [amountInWords]
}

export const getChequeTemplate = (bankCode, chequeType = CHEQUE_TYPES.BEARER) => {
    const bank = SRI_LANKAN_BANKS[bankCode] || SRI_LANKAN_BANKS.SAMPATH

    return {
        bank,
        type: chequeType,
        dimensions: CHEQUE_DIMENSIONS,
        positions: bankCode === 'SAMPATH' ? SAMPATH_CHEQUE_POSITIONS : {},
        isCross: chequeType === CHEQUE_TYPES.CROSS,
    }
}