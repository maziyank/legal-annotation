var annotation;(()=>{var e={138:(e,r,s)=>{const{normalize:o}=s(733),{cit_neutral:t}=s(84),{cit_party_only:n,cit_party_date:a,cit_party_unreported:c}=s(833),{cit_short:p}=s(871);e.exports=e=>{e=o(e);let r=[];return[t,n,a,c,p].forEach((s=>{r=r.concat(s(e))})),[...new Set(r)]}},84:(e,r,s)=>{const o=s(256),{denormalize:t}=s(733);e.exports={cit_neutral:e=>{const r=new RegExp(`${o.V.source}.{1,100}\\s+${o.CITEND.source}(\\s*${o.PINPOINT.source})?(\\s*of\\s+${o.DATE_DDMMMMYYYY.source})?`,"gm"),s=new RegExp(`.*\\s+${o.CITEND.source}(\\s*of\\s+${o.DATE_DDMMMMYYYY.source})?`,"gm"),n=new RegExp(`,\\s+${o.FULL_COURTNAME.source},\\s+${o.DATE_DDMMMMYYYY.source}`,"gm"),a=r=>{let s=[];if(cit_matches=Array.from(e.matchAll(r)),prefix_match=Array.from(e.matchAll(o.PREFIX)),cit_matches&&prefix_match){const r=cit_matches.map((e=>{const r=prefix_match.filter((r=>r.index<e.index));if(!r||0==r.length)return!1;const s=r[r.length-1];return[s.index+s[0].length,e.index+e[0].length]}));r&&(s=r.map((r=>e.slice(r[0],r[1]))),s=s.map((e=>t(e))))}return s},c=a(r),p=a(s).filter((e=>!o.V.test(e))),m=a(n);return[...new Set([...c,...p,...m])]}}},833:(e,r,s)=>{const o=s(256),{denormalize:t}=s(733);e.exports={cit_party_date:e=>{const r=new RegExp(`${o.PARTY_NAME.source}(\\s+[\\–\\-]?v\\.?)${o.PARTY_NAME.source}\\s+\\(${o.DATE_DDMMMMYYYY.source}\\)`,"gm");return Array.from(e.matchAll(r)).map((e=>t(e[0])))},cit_party_unreported:e=>{const r=new RegExp(`${o.PARTY_NAME.source}(\\s+[\\–\\-]?v\\.?)${o.PARTY_NAME.source}\\s+\\(${o.DATE_UNREPORTED.source}\\)`,"gm");return Array.from(e.matchAll(r)).map((e=>t(e[0])))},cit_party_only:e=>{const r=new RegExp(`${o.PARTY_NAME.source}(\\s+[\\–\\-]?v\\.?)${o.PARTY_NAME.source}(.{0,30})`,"gm"),s=new RegExp(`${o.PARTY_NAME.source}(\\s+[\\–\\-]?v\\.?)${o.PARTY_NAME.source}`,"gm");return Array.from(e.matchAll(r)).filter((e=>!o.YEAR.test(e)&&!o.UNUSUAL_1.test(e))).map((e=>s.exec(e))).filter((e=>e)).map((e=>t(e[0].trim()))).map((e=>e.replace(/\s(of|for|and|&|in|plc|the)$/gm)),"")}}},871:e=>{e.exports={cit_short:e=>{const r=new RegExp("R\\s*\\(.*\\)\\d+\\/\\d+","gm");return Array.from(e.matchAll(r),(e=>e[0])).map((e=>e.trim()))}}},839:e=>{e.exports={prefix:["on","see","appendix to","in","applied","appeal","accord","cites","cite","refer to","was said by","cited","on","by","at","with","to","of","for"],normalizer:[{from:"[sS]ee,? generally,",to:"see"},{from:"[sS]ee also",to:"see"},{from:"[sS]ee (in|on)",to:"see"},{from:"[sS]ee, for example,",to:"see"},{from:"see-",to:"see"},{from:"(\\.\\s+)In",to:". in"},{from:"^In",to:"in"},{from:"\\,?\\sand\\s",to:" and "},{from:"and\\s+((on)|(in))",to:"\n"},{from:"\\:\\s*",to:"\n"},{from:"\\;",to:"\n"},{from:"\\s-\\s",to:"\n"},{from:"\\s+–\\s+",to:"\n"},{from:"refer to the decision of the \\w+ in",to:"refer to"},{from:"([a-z]+\\s){2}([a-z]+\\,)",to:"see "}],month:["January","February","March","April","May","June","July","August","September","October","November","December"]}},256:(e,r,s)=>{const o=s(839),t={PREFIX:new RegExp(`((\\. +|:|\\(|\\s|^)(${o.prefix.map((e=>`(${e})`)).join("|")})\\s)|\\(|^|\\n|\\.\\s+`,"gm"),YEAR:new RegExp("((\\[\\d{4}\\])|(\\(\\d{4}\\))|\\d{4})"),V:new RegExp("(\\s[\\–\\-]?v[\\-\\.]?\\s)"),NUM_OR_SLASHEDNUM:new RegExp("(\\d+(\\/\\d+)*(\\,\\s\\d+)*(\\-\\d+)*)"),PINPOINT:new RegExp("(((at)|(at pp)|(\\,\\s+par[a]?[s]?)|(at p\\.)|(par[a]?[s]?)|(at par[a]?[s]?)|(at paragraph))\\s+((\\d+((-\\d+)|(\\,\\s+\\d+))*)|(\\[\\d+\\]((\\s*-\\s*)\\[\\d+\\])*)))"),STOPPER:new RegExp("(?=\\s|$|\\n|\\.|\\,|\\;|\\:|\\))"),DATE_DDMMMMYYYY:new RegExp(`(([0-9])|([0-2][0-9])|([3][0-1]))(rd|th|st)?\\s+(${o.month.join("|")})\\s+\\d{4}`),FULL_COURTNAME:new RegExp("(([A-Z][\\w\\-]+\\s)+(Tribunal))"),DIVISION:new RegExp("((\\([\\w\\d]*\\)))"),COURT_ABBV:new RegExp("((((\\s[A-Z]\\w*)){1,2})|((\\s([A-Z])([\\.A-Z])+)))"),PARTY_NAME:new RegExp("(((\\s|^)+([\\(\\-]?[A-Z][a-z\\,\\-]*[\\)\\-]?)(\\s+(of|for|%FOR%|%OF%|and|in|plc|&|the|Co\\.))?)+)")},n=t,a=new RegExp(`(.*${n.DATE_DDMMMMYYYY.source}\\,\\s+(unreported))`),c=new RegExp(`${n.YEAR.source}(\\s*${n.NUM_OR_SLASHEDNUM.source}?\\s*${n.COURT_ABBV.source}?\\s*${n.DIVISION.source}?\\s*${n.NUM_OR_SLASHEDNUM.source}\\s*${n.DIVISION.source}?)`),p=new RegExp(`${n.YEAR.source}\\s+(\\d+\\s(\\w+\\s){1,4}\\d+(\\s\\([A-Z]\\w+\\))*)`),m=new RegExp(`((\\(?\\w+(\\/\\w+)+\\)?))(\\s+of\\s+${n.DATE_DDMMMMYYYY.source})?`),i=new RegExp(`(${c.source}|${p.source}|${m.source}|(\\(${a.source}\\)))`,"g"),A=new RegExp(`(${c.source}|${p.source}|${m.source}${n.STOPPER.source})(\\.|(\\s+and\\s+))`,"gm");e.exports={...t,DATE_UNREPORTED:a,NEUTRAL:c,REPORT:p,UNUSUAL_1:m,CITEND:i,AND:A}},733:(e,r,s)=>{const o=s(839),t=s(256);e.exports={normalize:e=>(o.normalizer.forEach((({from:r,to:s})=>{e=e.replace(new RegExp(r,"gm"),s)})),match_and_=Array.from(e.matchAll(t.AND)),match_and_&&match_and_.forEach(((r,s)=>{index_and_=r.index+r[0].length,e=e.substring(0,index_and_+s)+"\n"+e.substring(index_and_+s)})),e=(e=(e=(e=e.replace(/(\(\S+\))(?=.*\sv\.?\s)/gm,(e=>e.replace(/\(|\)/g,"-")))).replace(/(\(\S+\))(?=.*((\[\d{4}\])|(\(\d{4}\))|(\d{4})))/gm,(e=>e.replace(/\(|\)/g,"-")))).replace(/(?<=[A-Z]\w+)(\sof\s)(?=[A-Z])/gm,(e=>e.replace(" of "," %OF% ")))).replace(/(?<=[A-Z]\w+)(\sfor\s)(?=[A-Z])/gm,(e=>e.replace(" for "," %FOR% ")))),denormalize:e=>{if(e)return(e=(e=(e=(e=e.replace(/\-\S+\-/gm,(e=>`(${e.slice(1,e.length-1)})`))).replace(" %OF% "," of ")).replace(" %FOR% "," for ")).trim()).replace(/,$/,"")}}}},r={},s=function s(o){var t=r[o];if(void 0!==t)return t.exports;var n=r[o]={exports:{}};return e[o](n,n.exports,s),n.exports}(138);annotation=s})();