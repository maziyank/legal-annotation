# Legal Citation Annotation

## Supported Patterns
We aims to detect case law citation on law texts using heuristic approach. We employe regular expression and string matching methods in javascript. Currently our script expected to be able to detect the following citation patterns:

| No  | Pattern Name                                          | Example                                                                                                                                                                                                                                                                                                                                                                                                                                       | Status |
| --- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1   | Neutral Citation                                      | * AAA v Associated Newspapers Ltd [2013] EWCA Civ 554<br>* Manchester College of Arts and Technology (MANCAT) v Mr G Smith [2007] UKEAT 0460/06                                                                                                                                                                                                                                                                                               | Done   |
| 2   | Neutral Citation with Divisions Name                  | * PricewaterhouseCooper v Information Commissioner [2011] UKUT 372 (AAC)<br>* Ministry of Defence v MacLachlan [2016] EWHC 3733 (QB)<br>* WC Leng & Co Ltd v Andrews [1909] 1 Ch 763 (CA)<br><br>* Johnson v Medical Defence Union Ltd [2004] EWHC 2509 (Ch)<br>* R (Hume) v Londonderry Justices [1972] NI 91 (DC) <br>* R (HTV Ltd) v Bristol City Council [2004] EWHC 1219 (Admin)<br>* HSH Nordbank AG v Saad Air [2012] EWHC 3213 (Comm) | Done   |
| 3   | Neutral Citation with Divisions Name after Court Abbr | BB v Secretary of State for Work and Pensions (PIP) [2017] UKUT (AAC) 596                                                                                                                                                                                                                                                                                                                                                                     | Done   |
| 4   | Report Citation                                       | * Pope v Curl (1741) 2 Atk 342 Jefferys v Boosey<br>* (1854) 4 HL Cas 815 John Robinson & Co v King, The [1921] 3 KB 183 Parry-Jones v Law Society [1969] 1 Ch 1                                                                                                                                                                                                                                                                              | Done   |
| 5   | Report Citation With Court Division Name              | Pope v Curl (1948) 92 SJ 220 (Ch)                                                                                                                                                                                                                                                                                                                                                                                                             | Done   |
| 6   | Case Name, With Courtname and Date                    | * Northern Ireland v Information Commissioner and Collins, First-tier Tribunal, 3 June 2011<br>* Public Prosecution Service for Northern Ireland v Information Commissioner and Collins, First-tier Tribunal, 3 June 2011<br> * Poplar Housing Association and Regeneration Community Association v Information Commissioner & anor, First-tier Tribunal, 20 February 2019                                                                    | Done   |
| 5   | Only Case Name Without Reference                      | …In Al Adsani v United Kingdom the Government contended, as recorded at paragraph 50…                                                                                                                                                                                                                                                                                                                                                         | Done   |
| 6   | Without Case Name, Only Case Reference                | agreeing with what was said in R(M) 1/78                                                                                                                                                                                                                                                                                                                                                                                                      | To Do  |
| 7   | Multiple Reported                                     | * Prebble v Television New Zealand Ltd [1995] 1 AC 321, [1994] 3 WLR 970, [1994] 3 All ER 407 (PC)<br><br>* Neale v Hereford and Worcester CC [1986] ICR 471, [1986] IRLR 168 (CA)                                                                                                                                                                                                                                                            | Done   |
| 8   | Other                                                 | K (Infants) [1963] Ch 381                                                                                                                                                                                                                                                                                                                                                                                                                     | To Do  |


### Dataset

We also collect some piece of law text as test case with manually extracted citation. Please see `dataset` folder. 


### Test Case

For evaluating precision and recall please run

```js
npm run eval
```

or

```js
node evaluate.js
```

### Usage

execute `annotate` method that return promise.

```js
annotate("sample text", ["NEUTRAL", "PARTY_ONLY", "PARTY_DATE", "PARTY_UNREPORTED", "SHORT"]).then(
        data => .... ,
        error => ....
)
```