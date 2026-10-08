const REAL_DEPOSITS = [
  {
    "bank": "建设银行",
    "amount": 60000,
    "maturity": "2027-04-19",
    "date": null,
    "period": "三年",
    "rate": 0.0235,
    "rateBasis": "用户指定年利率",
    "rateChecked": "2026-10-09"
  },
  {
    "bank": "工商银行",
    "amount": 350000,
    "maturity": null,
    "date": null,
    "period": "三年",
    "rate": 0.0125,
    "rateBasis": "三年期整存整取挂牌利率，仅用于展示测算",
    "rateChecked": "2026-10-09",
    "rateEffective": "2025-05-20",
    "rateSource": "https://www.icbc.com.cn/page/721852466856755204.html"
  },
  {
    "bank": "建设银行",
    "amount": 454101,
    "maturity": "2028-10-15",
    "date": null,
    "period": "三年",
    "rate": 0.0125,
    "rateBasis": "三年期整存整取挂牌利率，仅用于展示测算",
    "rateChecked": "2026-10-09",
    "rateEffective": "2025-05-20",
    "rateSource": "https://www.ccb.com/chn/personal/interestv3/rmbdeposit.shtml",
    "maturityTotal": 475071,
    "maturityInterest": 20970,
    "payoutBasis": "用户指定到期本息，优先于挂牌利率测算"
  },
  {
    "bank": "农业银行",
    "amount": 160000,
    "maturity": null,
    "date": null,
    "period": "三年",
    "rate": 0.0125,
    "rateBasis": "三年期整存整取挂牌利率，仅用于展示测算",
    "rateChecked": "2026-10-09",
    "rateEffective": "2025-05-20",
    "rateSource": "https://www.abchina.com.cn/cn/PersonalServices/Quotation/bwbll/"
  }
];
if(typeof module!=="undefined")module.exports=REAL_DEPOSITS;
