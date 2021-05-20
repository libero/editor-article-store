const data = {
  xml: `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE article PUBLIC "-//NLM//DTD JATS (Z39.96) Journal Archiving and Interchange DTD with MathML3 v1.2 20190208//EN" "JATS-archivearticle1-mathml3.dtd">
  <!-- Use JATS 1.2 -->
  <!-- All XML would be on one line (with the exception of code snippets with new lines). 
       Only pretty-printed here for readability -->
  <!-- @specific-use on <article> used to indicate whether the article is PoA, VoR, V2+ VoR
        PoA = accepted-manuscript 
        VoR = version-of-record
        VoR V2 = corrected-version-of-record -->
  <article article-type="article-commentary" dtd-version="1.2" specific-use="version-of-record" xmlns:mml="http://www.w3.org/1998/Math/MathML" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ali="http://www.niso.org/schemas/ali/1.0/">
      <front>
          <journal-meta>
              <journal-id journal-id-type="nlm-ta">elife</journal-id>
              <journal-id journal-id-type="publisher-id">eLife</journal-id>
              <journal-title-group>
                  <journal-title>eLife</journal-title>
              </journal-title-group>
              <issn publication-format="electronic" pub-type="epub">2050-084X</issn>
              <publisher>
                  <publisher-name>eLife Sciences Publications, Ltd</publisher-name>
              </publisher>
          </journal-meta>
          <article-meta>
              <article-id pub-id-type="publisher-id">00666</article-id>
              <article-id pub-id-type="doi">10.7554/eLife.00666</article-id>
              <article-categories>
                  <!-- Change disp-channel to heading (heading needed for PMC)  -->
                  <subj-group subj-group-type="heading">
                      <subject>Research Article</subject>
                  </subj-group>
                  <!-- Change heading to major-subject (better semantics)
                       More than one subject allowed in the same subj-group -->
                  <subj-group subj-group-type="major-subject">
                      <subject>Medicine</subject>
                      <subject>Neuroscience</subject>
                  </subj-group>
              </article-categories>
              <title-group>
                  <article-title>eLife kitchen sink 2.0</article-title>
              </title-group>
              <!-- Add content-type="authors" to contrib-group -->
              <contrib-group content-type="authors">
                  <!-- Remove id attribute from authors -->
                  <contrib contrib-type="author" equal-contrib="yes" corresp="yes">
                      <name>
                          <surname>Atherden</surname>
                          <given-names>Frederick Peter</given-names>
                          <suffix>III</suffix>
                      </name>
                      <!-- Contributions included in role using credit taxonomy.
                           Roles appear next to name in author list in PMC, which is not ideal. -->
                      <role vocab="credit" vocab-identifier="http://credit.niso.org/"
                          vocab-term="Conceptualization" 
                          vocab-term-identifier="http://credit.niso.org/contributor-roles/conceptualization/">Conceptualization</role>
                      <role vocab="credit" vocab-identifier="http://credit.niso.org/" vocab-term="Writing – original draft" 
                          vocab-term-identifier="http://credit.niso.org/contributor-roles/writing-original-draft/">Writing – original draft</role>
                      <!-- Non-credit taxonomy roles included here without the attributes -->
                      <role>I also added this thing which isn't part of the credit taxonomy</role>
                      <!-- Remove authenticated attribute -->
                      <contrib-id contrib-id-type="orcid">https://orcid.org/0000-0002-6048-1470</contrib-id>
                      <!-- Optional twitter handle
                           Could be used instead of email for 'correspondence' if desired
                           Note that this doesn't display on PMC -->
                      <contrib-id contrib-id-type="twitter">@twitter-handle</contrib-id>
                      <xref ref-type="aff" rid="aff1">1</xref>
                      <xref ref-type="author-notes" rid="equal-contrib1">†</xref>
                      <xref ref-type="author-notes" rid="fn1">‡</xref>
                      <!-- Without content, these do not show up well in PMC. Do we want to add indicators for these as well? -->
                      <xref ref-type="author-notes" rid="con1"/>
                  </contrib>
                  <contrib contrib-type="author" equal-contrib="yes" corresp="yes">
                      <name>
                          <surname>Harrison</surname>
                          <given-names>Melissa</given-names>
                      </name>
                      <role vocab="credit" vocab-identifier="http://credit.niso.org/" vocab-term="Conceptualization" 
                          vocab-term-identifier="http://credit.niso.org/contributor-roles/conceptualization/">Conceptualization</role>
                      <role vocab="credit" vocab-identifier="http://credit.niso.org/" vocab-term="Writing – review &amp; editing" 
                          vocab-term-identifier="http://credit.niso.org/contributor-roles/writing-review-editing/">Writing – review &amp; editing</role>
                      <contrib-id contrib-id-type="orcid">https://orcid.org/0000-0002-4932-938X</contrib-id>
                      <email>...@elifesciences.org</email>
                      <xref ref-type="aff" rid="aff1">1</xref>
                      <xref ref-type="author-notes" rid="equal-contrib1">†</xref>
                      <xref ref-type="author-notes" rid="fn1">‡</xref>
                      <xref ref-type="author-notes" rid="con2"/>
                  </contrib>
                  <contrib contrib-type="author" corresp="yes">
                      <collab>Example Group author
                          <contrib-group content-type="group-members">
                              <contrib contrib-type="author">
                                  <name>
                                      <surname>Gilbert</surname>
                                      <given-names>James</given-names>
                                  </name>
                                  <contrib-id contrib-id-type="orcid">https://orcid.org/0000-1002-4932-938X</contrib-id>
                                  <!-- Group members link to affiliations in the overall authors contrib-group -->
                                  <xref ref-type="aff" rid="aff1">1</xref>
                                  <xref ref-type="author-notes" rid="con2"/>
                              </contrib>
                          </contrib-group>
                      </collab>
                      <!-- group author roles added at the top level -->
                      <role vocab="credit" vocab-identifier="http://credit.niso.org/" vocab-term="Formal Analysis" 
                          vocab-term-identifier="http://credit.niso.org/contributor-roles/formal-analysis/">Formal Analysis</role>
                      <role vocab="credit" vocab-identifier="http://credit.niso.org/" vocab-term="Visualization" 
                          vocab-term-identifier="http://credit.niso.org/contributor-roles/visualization/">Visualization</role>
                      <email>...@elifesciences.org</email>
                  </contrib>
                  <!-- No footnote for deceased, just deceased="yes" attribute.
                       Does not display on PMC.
                       And not really deceased!! -->
                  <contrib contrib-type="author" equal-contrib="yes" deceased="yes">
                      <name>
                          <surname>Claus</surname>
                          <given-names>Santa</given-names>
                      </name>
                      <role vocab="credit" vocab-identifier="http://credit.niso.org/" vocab-term="Resources" 
                          vocab-term-identifier="http://credit.niso.org/contributor-roles/resources/">Resources</role>
                      <role vocab="credit" vocab-identifier="http://credit.niso.org/" vocab-term="Supervision" 
                          vocab-term-identifier="http://credit.niso.org/contributor-roles/supervision/">Supervision</role>
                      <xref ref-type="aff" rid="aff1">1</xref>
                      <xref ref-type="author-notes" rid="equal-contrib2">§</xref>
                      <xref ref-type="author-notes" rid="con2"/>
                  </contrib>
                  <contrib contrib-type="author" equal-contrib="yes">
                      <name>
                          <surname>West</surname>
                          <given-names>Cornel</given-names>
                          <suffix>Jnr</suffix>
                      </name>
                      <role vocab="credit" vocab-identifier="http://credit.niso.org/" vocab-term="Investigation" 
                          vocab-term-identifier="http://credit.niso.org/contributor-roles/investigation/">Investigation</role>
                      <role vocab="credit" vocab-identifier="http://credit.niso.org/" vocab-term="Methodology" 
                          vocab-term-identifier="http://credit.niso.org/contributor-roles/methodology/">Methodology</role>
                      <role vocab="credit" vocab-identifier="http://credit.niso.org/" vocab-term="Validation" 
                          vocab-term-identifier="http://credit.niso.org/contributor-roles/validation/">Validation</role>
                      <xref ref-type="aff" rid="aff2">2</xref>
                      <xref ref-type="author-notes" rid="equal-contrib2">§</xref>
                      <xref ref-type="author-notes" rid="con2"/>
                  </contrib>
                  <on-behalf-of>on behalf of whoever finds this interesting</on-behalf-of>
                  <aff id="aff1">
                      <label>1</label>
                      <institution>The department of production, eLife Sciences</institution>
                      <!-- city instead of named-content[@content-type='city']. 
                           No need for addr-line -->
                      <city>Cambridge</city>
                      <!-- Add optional state field -->
                      <state>Cambridgeshire</state>
                      <!-- country attribute added. Value is 2-digit country code, as specified in ISO 3166-1 -->
                      <country country="GB">United Kingdom</country>
                  </aff>
                  <aff id="aff2">
                      <label>2</label>
                      <!-- ROR id included institution-id 
                          Not all instutitions may have one so its presence is optional 
                      -->
                      <institution-wrap>
                          <institution-id institution-id-type="ror">https://ror.org/046rm7j60</institution-id>
                          <institution>JATS4R</institution>
                      </institution-wrap>
                      <city>Bethesda</city>
                      <state>Maryland</state>
                      <country country="US">United States</country>
                  </aff>
              </contrib-group>
              <!-- Change content-type to peer-review -->
              <contrib-group content-type="peer-review">
                  <contrib contrib-type="senior_editor">
                      <name>
                          <surname>Eisen</surname>
                          <given-names>Mike</given-names>
                      </name>
                      <role>Senior Editor</role>
                      <aff>
                          <institution-wrap>
                              <institution-id institution-id-type="ror">https://ror.org/01an7q238</institution-id>
                              <institution>University of California, Berkeley</institution>
                          </institution-wrap>
                          <city>Berkeley</city>
                          <state>California</state>
                          <country country="US">United States</country>
                      </aff>
                  </contrib>
                  <contrib contrib-type="editor">
                      <name>
                          <surname>Helaine</surname>
                          <given-names>Sophie</given-names>
                      </name>
                      <role>Reviewing Editor</role>
                      <aff>
                          <institution>Imperial College London</institution>
                          <country country="GB">United Kingdom</country>
                      </aff>
                  </contrib>
              </contrib-group>
              <author-notes>
                  <!-- Footnote labels follow this sequence:
                          †, ‡, §, ¶, ††, ‡‡, §§, ¶¶ etc. -->
                  <fn fn-type="con" id="equal-contrib1"><label>†</label><p>These authors contributed equally to this work</p></fn>
                  <fn fn-type="con" id="equal-contrib2"><label>§</label><p>These authors also contributed equally to this work</p></fn>
                  <!-- General use footnotes used for vanity notes etc. -->
                  <fn fn-type="other" id="fn1"><label>‡</label><p>Author order was decided on a coin toss.</p></fn>
                  <!-- coi statements moved from sec[@sec-type="additional-information"] in <back> to here -->
                  <fn fn-type="COI-statement" id="con1"><p>is a member of some group, and has shares in some company. No other competing interests to declare.</p></fn>
                  <fn fn-type="COI-statement" id="con2"><p>No competing interests declared</p></fn>
              </author-notes>
              <!-- Include iso-8601-date attribute  
                  First pub-date (date-type="pub") is the original publication date (PoA) -->
              <pub-date publication-format="electronic" date-type="pub" iso-8601-date="2020-09-22">
                  <day>22</day>
                  <month>09</month>
                  <year>2020</year>
              </pub-date>
              <!-- Second pub date contains the latest publication. In this case the VoR.
                   date-type="update" attribute for VoR.
                   Any new version would replace this pub-date[@date-type="update"] and the old VoR pub-date 
                          would be moved down as an <event> in <pub-history>.   
              -->
              <pub-date publication-format="electronic" date-type="update" iso-8601-date="2020-10-22">
                  <day>22</day>
                  <month>10</month>
                  <year>2020</year>
              </pub-date>
              <!-- No pub-date[@pub-type="collection"]
                   PoA/VoR can be determined by specific-use attribute on root <article> as described above.
              -->
              <volume>9</volume>
              <elocation-id>e00666</elocation-id>
              <history>
                  <date date-type="received" iso-8601-date="2020-03-20">
                      <day>20</day>
                      <month>03</month>
                      <year>2020</year>
                  </date>
                  <date date-type="accepted" iso-8601-date="2020-09-18">
                      <day>18</day>
                      <month>09</month>
                      <year>2020</year>
                  </date>
              </history>
              <!-- events added to pub-history.
                   Pending JATS4R rec has this in <history> but that is not currently allowed in JATS 1.2.
                   In the event of a new version, the first (or more) VoR publication dates would move down here as an event 
                          and the new version publicaiton date would replace pub-date[@date-type="update"] above.
                   VoR dates in the <event> would have a self-uri[@content-type="version-of-record"].
                   Any new version pub dates moved to event (for example if there were 2+ new versions) would have a 
                          self-uri[@content-type="corrected-version-of-record"].
              -->
              <pub-history>
                  <!-- events added in chronological order -->
                  <event>
                      <event-desc>This manuscript was published as a preprint at bioRxiv.</event-desc>
                      <date date-type="preprint" iso-8601-date="2019-02-15">
                          <day>15</day>
                          <month>02</month>
                          <year>2019</year>
                      </date>    
                      <!-- Should this be content-type="preprint" or content-type="pre-print"? Examples and text in JATS4R conflict
                              https://jats4r.org/article-publication-and-history-dates/ -->
                      <self-uri content-type="preprint" xlink:href="https://www.biorxiv.org/content/10.1101/2019.08.22.6666666v1"/>   
                  </event>
                  <event>
                      <event-desc>The first version of this article was published as an accepted manuscript.</event-desc>
                      <date date-type="accepted-manuscript" iso-8601-date="2020-09-22">
                          <day>22</day>
                          <month>09</month>
                          <year>2020</year>
                      </date>
                      <self-uri content-type="accepted-manuscript" xlink:href="https://elifesciences.org/articles/00666v1"/>
                  </event>
              </pub-history>
              <permissions>
                  <copyright-statement>© 2020, Atherden et al</copyright-statement>
                  <copyright-year>2020</copyright-year>
                  <copyright-holder>Atherden et al</copyright-holder>
                  <ali:free_to_read/>
                  <license xlink:href="http://creativecommons.org/licenses/by/4.0/">
                      <ali:license_ref>http://creativecommons.org/licenses/by/4.0/</ali:license_ref>
                      <license-p>This article is distributed under the terms of the <ext-link ext-link-type="uri" xlink:href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution License</ext-link>, which permits unrestricted use and redistribution provided that the original author and source are credited.</license-p>
                  </license>
              </permissions>
              <self-uri content-type="pdf" xlink:href="elife-00666.pdf"/>
              <!-- self-uri for (optional) figures pdf too -->
              <self-uri content-type="pdf" xlink:href="elife-00666-figures.pdf"/>
              <!-- specific-use added to related-article which defines what kind of link it is for the benefit of lax/display on the journal
              Research Advance -> Research Article can be builds-upon or related-to
              Anything else to -> Anything else = related-to
              -->
              <related-article ext-link-type="doi" id="ra1" related-article-type="article-reference" specific-use="builds-upon" xlink:href="10.7554/eLife.16381"/>
              <related-article ext-link-type="doi" id="ra2" related-article-type="article-reference" specific-use="related-to" xlink:href="10.7554/eLife.43788"/>
              <!-- abstract is used for impact statements instead of custom-meta -->
              <abstract abstract-type="toc">
                  <p>some impact statement</p>
              </abstract>
              <abstract>
                  <p>some abstract</p>
              </abstract>
              <abstract abstract-type="executive-summary">
                  <title>eLife digest</title>
                  <p>This is a digest.</p>
              </abstract>
              <!-- kwd-group-type="author-keywords" changed to kwd-group-type="author-generated" -->
              <kwd-group kwd-group-type="author-generated">
                  <kwd>flight</kwd>
                  <kwd>swimming</kwd>
                  <kwd>locomotion</kwd>
                  <kwd>muscle efficiency</kwd>
                  <kwd>strouhal number</kwd>
                  <kwd>wing</kwd>
              </kwd-group>
              <kwd-group kwd-group-type="research-organism">
                  <!-- title (<title>Research organism</title>) is removed -->
                  <kwd>Human</kwd>
                  <kwd>Mouse</kwd>
              </kwd-group>
              <!-- Funding is no longer linked to from the authors (using xref), since this information is not displayed in the pop-up on the website anyway
                   If a funding source is not in the open funder registry then there is no institution-id
                   If the funder is in the open funder registry then there is an institution-id -->
              <funding-group>
                  <award-group id="fund1">
                      <!-- country attribute added to funding-source -->
                      <funding-source country="US">
                          <institution-wrap>
                              <!-- vocab and vocab-identifier attribute added. institution-id-type changed to doi -->
                              <institution-id institution-id-type="doi" vocab="open-funder-registry" vocab-identifier="10.13039/open-funder-registry">10.13039/100000002</institution-id>
                              <institution>National Institutes of Health</institution>
                          </institution-wrap>
                      </funding-source>
                      <award-id>DA037327</award-id>
                      <!-- No longer any need to identify which authors were benefited by which funding -->
                  </award-group>
                  <award-group id="fund2">
                      <funding-source country="GB">
                          <institution-wrap>
                              <institution>eLife Sciences</institution>
                          </institution-wrap>
                      </funding-source>
                      <award-id>00000000001</award-id>
                  </award-group>
                  <funding-statement>The funders had no role in study design, data collection and interpretation, or the decision to submit the work for publication.</funding-statement>
              </funding-group>
              <custom-meta-group>
                  <custom-meta specific-use="meta-only">
                      <!-- Change from Template to pdf-template -->
                      <meta-name>pdf-template</meta-name>
                      <!-- All articles given this value, even research articles. If we were not to simplify our current PDF templates, then it could be template 6 -->
                      <meta-value>6</meta-value>
                  </custom-meta>
                  <custom-meta specific-use="meta-only">
                      <!-- New custom meta-name -->
                      <meta-name>source-file-type</meta-name>
                      <!-- File type for original manuscript. latex or word (or others if needed) -->
                      <meta-value>latex</meta-value>
                  </custom-meta>
                  <!-- Add flag for XML version. This specfies that the file is in the new format -->
                  <custom-meta specific-use="meta-only">
                      <meta-name>elife-xml-version</meta-name>
                      <meta-value>2.0</meta-value>
                  </custom-meta>
              </custom-meta-group>
          </article-meta>
      </front>
      <body>
        <p>Hello World</p>
      </body>
      <back>
          <ack id="ack">
            <title>Acknowledgements</title>
            <p>acknowledgement</p>
          </ack>
          <sec id="s5" sec-type="additional-information">
              <title>Additional information</title>
              <sec id="s5-1" sec-type="ethics-statement">
                  <title>Ethics</title>
                  <!-- Add content-type to <p>s -->
                  <p content-type="ethics-approval-human">Human subjects: Fresh tissue samples were obtained upon informed consent from patients undergoing surgery at the Gynecology Division of the European Institute of Oncology (Milan). Sample collection was performed under the protocol number R789-IEO approved by the Ethics Committee of the European Institute of Oncology.</p>
                  <p content-type="ethics-approval-animal">Animal experimentation: All animal studies were performed following a protocol approved by the fully authorized animal facility of European  Institute of Oncology and by the Italian Ministry of Health (as required by the Italian Law) (IACUCs number 1256/2015) and in accordance to EU directive 2010/63. Mouse tissues were obtained from Karolinska Institutet (Stockholm, Sweden) and IRCCS San Raffaele Scientific Institute (Milan, Italy), in  accordance with Institutional Animal Care and Use Committees.</p>
                  <p>Clinical trial registration <related-object document-id="NCT01967030" 
                      document-id-type="clinical-trial-number" 
                      id="RO3" 
                      source-id="ClinicalTrials.gov" 
                      source-id-type="registry-name" 
                      source-type="clinical-trials-registry" xlink:href="https://clinicaltrials.gov/show/NCT01967030"
                      >NCT01967030</related-object>. Protocols can be assessed at ...</p>
              </sec>
          </sec>
          <sec id="s6" sec-type="supplementary-material">
              <title>Additional files</title>         
              <supplementary-material id="supp1">   
                  <label>Supplementary file 1.</label>
                  <caption>
                      <title>This is the title of the supplementary file 1 (<xref ref-type="bibr" rid="bib14">Srinivasan, 2019</xref>).</title>
                      <p>A file containing underlying data.</p>
                  </caption>
                  <media mimetype="application" mime-subtype="csv" xlink:href="elife-00666-supp1.csv"/>
              </supplementary-material>
              <supplementary-material id="audio1">
                  <label>Audio file 1.</label>
                  <caption>
                      <title>This is a title for an audio file.</title>
                  </caption>
                  <media mime-subtype="x-wav" mimetype="audio" xlink:href="elife-00666-audio1.wav"/></supplementary-material>
              <supplementary-material id="sdata1">   
                  <label>Source data 1.</label>
                  <caption>
                      <title>This is the title of the source data that is not attached to a specific figure, but to the article as a whole.</title>
                  </caption>
                  <media mimetype="application" mime-subtype="xlsx" xlink:href="elife-00666-data1.xlsx"/>
              </supplementary-material>
              <supplementary-material id="scode1">   
                  <label>Source code 1.</label>
                  <caption>
                      <title>This is the title of the source code that is not attached to a specific figure, but to the article as a whole.</title>
                  </caption>
                  <media mimetype="application" mime-subtype="zip" xlink:href="elife-00666-code1.zip"/>
              </supplementary-material>
              <supplementary-material id="repstand1">
                  <label>Reporting standard 1.</label>
                  <caption>
                      <title>CONSORT checklist.</title>
                  </caption>
                  <media mimetype="application" mime-subtype="pdf" xlink:href="elife-00666-repstand1.pdf"/>
              </supplementary-material>
              <supplementary-material id="transrepform">
                  <label>Transparent reporting form</label>
                  <media mimetype="application" mime-subtype="pdf" xlink:href="elife-00666-transrepform.pdf"/>
              </supplementary-material>
          </sec>
          <!-- Add glossary. This contains abbreviations that can be linked to throughout the article (main text, appendices, tables figure captions etc.). -->
          <glossary>
              <title>Abbreviations</title>
              <def-list>
                  <def-item id="def1">
                      <!-- italic, monospace, sup and sub permitted in term -->
                      <term>Aoin<sup>2</sup></term>
                      <def>
                          <p>This definition can also contain minimal formatting such as <bold>bold</bold>, <italic>italic</italic> <sup>superscript</sup>, and <sub>subscript</sub></p>
                      </def>
                  </def-item>
                  <def-item id="def2">
                      <term>GLV<italic>s</italic></term>
                      <def>
                          <p>Green leaf volatiles</p>
                      </def>
                  </def-item>
                  <def-item id="def3">
                      <term>Hip1R</term>
                      <def>
                          <p>Huntingtin-interacting protein 1-related protein</p>
                      </def>
                  </def-item>
                  <def-item id="def4">
                      <term>sapien</term>
                      <def>
                          <p>This is the definition for the term</p>
                      </def>
                  </def-item>
              </def-list>
          </glossary>
          <sec id="s7" sec-type="data-availability">
              <title>Data availability</title>
              <!-- data references are included in the ref list and can be cited, as in the main text -->
              <p>Sequencing data have been deposited in GEO under accession code GSE143275 (<xref ref-type="bibr" rid="bib5">Hao et al., 2020</xref>). We also used some data from Dryad (<xref ref-type="bibr" rid="bib8">Kok et al., 2015</xref>). All other data generated or analysed during this study are included in the manuscript and supporting files. MATLAB scripts used to generate Figures 1-3 are available at <ext-link ext-link-type="uri" xlink:href="https://github.com/wyartlab/Cantaut-Belarif-et-al.-2020">GitHub</ext-link> (copy archived at <xref ref-type="bibr" rid="bib1">Cantaut-Belarif et al., 2020</xref>).</p>
          </sec>
          <ref-list>
              <title>References</title>
              <ref id="bib1">
                <element-citation publication-type="software">
                  <person-group person-group-type="author">
                    <name>
                      <surname>Cantaut-Belarif</surname>
                      <given-names>Y</given-names>
                    </name>
                    <name>
                      <surname>Orts Del'Immagine</surname>
                      <given-names>A</given-names>
                    </name>
                    <name>
                      <surname>Penru</surname>
                      <given-names>M</given-names>
                    </name>
                    <name>
                      <surname>Pézeron</surname>
                      <given-names>G</given-names>
                    </name>
                    <name>
                      <surname>Wyart</surname>
                      <given-names>C</given-names>
                    </name>
                    <name>
                      <surname>Bardet</surname>
                      <given-names>P-L</given-names>
                    </name>
                  </person-group>
                  <year iso-8601-date="2020">2020</year>
                  <article-title>MATLAB scripts for Adrenergic activation modulates the signal from the Reissner fiber to cerebrospinal fluid-contacting neurons during development</article-title>
                  <source>Software Heritage</source>
                    <ext-link ext-link-type="uri" xlink:href="https://archive.softwareheritage.org/swh:1:rev:3396034de4726cb8c895a6e43bbc3d774b726fcb/">https://archive.softwareheritage.org/swh:1:rev:3396034de4726cb8c895a6e43bbc3d774b726fcb/</ext-link>
                </element-citation>
              </ref>
              <ref id="bib2">
                <element-citation publication-type="book">
                  <person-group person-group-type="author">
                    <name>
                      <surname>Feyerabend</surname>
                      <given-names>PK</given-names>
                    </name>
                  </person-group>
                  <year iso-8601-date="2010">2010</year>
                  <source>Against Method</source>
                  <edition>4th Edition</edition>
                  <publisher-loc>London</publisher-loc>
                  <publisher-name>Verso</publisher-name>
                  <pub-id pub-id-type="isbn">978-1844674428</pub-id>
                </element-citation>
              </ref>
              <ref id="bib3">
                <element-citation publication-type="journal">
                  <person-group person-group-type="author">
                    <name>
                      <surname>Galkin</surname>
                      <given-names>VE</given-names>
                    </name>
                    <name>
                      <surname>Orlova</surname>
                      <given-names>A</given-names>
                    </name>
                    <name>
                      <surname>Salmazo</surname>
                      <given-names>A</given-names>
                    </name>
                    <name>
                      <surname>Djinovic-Carugo</surname>
                      <given-names>K</given-names>
                    </name>
                    <name>
                      <surname>Egelman</surname>
                      <given-names>EH</given-names>
                    </name>
                  </person-group>
                  <year iso-8601-date="2010">2010a</year>
                  <article-title>Opening of tandem calponin homology domains regulates their affinity for F-actin</article-title>
                  <source>Nature Structural &amp; Molecular Biology</source>
                  <volume>17</volume>
                  <fpage>614</fpage>
                  <lpage>616</lpage>
                  <pub-id pub-id-type="doi">10.1038/nsmb.1789</pub-id>
                  <pub-id pub-id-type="pmid">20383143</pub-id>
                </element-citation>
              </ref>
              <!-- Note that this comes first even through the author list would suggest otherwise 
                  as it has been given 'b' in the year because it is cited second -->
              <ref id="bib4">
                <element-citation publication-type="journal">
                  <person-group person-group-type="author">
                    <name>
                      <surname>Galkin</surname>
                      <given-names>VE</given-names>
                    </name>
                    <name>
                      <surname>Schröder</surname>
                      <given-names>GF</given-names>
                    </name>
                    <name>
                      <surname>Orlova</surname>
                      <given-names>A</given-names>
                    </name>
                    <name>
                      <surname>Egelman</surname>
                      <given-names>EH</given-names>
                    </name>
                  </person-group>
                  <year iso-8601-date="2010">2010b</year>
                  <article-title>Structural polymorphism in F-actin</article-title>
                  <source>Nature Structural &amp; Molecular Biology</source>
                  <volume>17</volume>
                  <fpage>1318</fpage>
                  <lpage>1323</lpage>
                  <pub-id pub-id-type="doi">10.1038/nsmb.1930</pub-id>
                  <pub-id pub-id-type="pmid">20935633</pub-id>
                </element-citation>
              </ref>
              <!-- dataset refs moved from DAS to ref-list. id attribute removed from the element-citation 
              specific-use="generated" for any datasets generated for this work -->
              <ref id="bib5">
                <element-citation publication-type="data" specific-use="generated">
                  <person-group person-group-type="author">
                    <name>
                      <surname>Hao</surname>
                      <given-names>Q</given-names>
                    </name>
                    <name>
                      <surname>Prasanth</surname>
                      <given-names>KV</given-names>
                    </name>
                    <name>
                      <surname>Sun</surname>
                      <given-names>Q</given-names>
                    </name>
                  </person-group>
                  <year iso-8601-date="2020">2020</year>
                  <data-title>poly A+ RNA sequencing of cell cycle-synchronized RNA from U2OS cells</data-title>
                  <source>NCBI Gene Expression Omnibus</source>
                  <pub-id pub-id-type="accession" xlink:href="https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE143275">GSE143275</pub-id>
                </element-citation>
              </ref>
              <ref id="bib6">
                <element-citation publication-type="web">
                  <person-group person-group-type="author">
                    <name>
                      <surname>Harmon</surname>
                      <given-names>A</given-names>
                    </name>
                  </person-group>
                  <year iso-8601-date="2019">2019</year>
                  <article-title>James Watson had a chance to salvage his reputation on race. He made things worse</article-title>
                  <source>The New York Times</source>
                  <ext-link ext-link-type="uri" xlink:href="https://www.nytimes.com/2019/01/01/science/watson-dna-genetics-race.html">https://www.nytimes.com/2019/01/01/science/watson-dna-genetics-race.html</ext-link>
                  <date-in-citation iso-8601-date="2019-01-01">January 1, 2019</date-in-citation>
                </element-citation>
              </ref>
              <ref id="bib7">
                <element-citation publication-type="book">
                  <person-group person-group-type="author">
                    <name>
                      <surname>Hogarth</surname>
                      <given-names>KM</given-names>
                    </name>
                    <name>
                      <surname>Jaroszz</surname>
                      <given-names>J</given-names>
                    </name>
                    <name>
                      <surname>Butler</surname>
                      <given-names>P</given-names>
                    </name>
                  </person-group>
                  <year iso-8601-date="2012">2012</year>
                  <chapter-title>The skull and brain</chapter-title>
                  <person-group person-group-type="editor">
                    <name>
                      <surname>Butler</surname>
                      <given-names>P</given-names>
                    </name>
                    <name>
                      <surname>Mitchell</surname>
                      <given-names>A</given-names>
                    </name>
                    <name>
                      <surname>Healy</surname>
                      <given-names>JC</given-names>
                    </name>
                  </person-group>
                  <source>Applied Radiological Anatomy</source>
                  <edition>2nd Edition</edition>
                  <publisher-loc>Cambridge</publisher-loc>
                  <publisher-name>Cambridge University Press</publisher-name>
                  <fpage>1</fpage>
                  <lpage>32</lpage>
                  <pub-id pub-id-type="doi">10.1017/CBO9780511977930.001</pub-id>
                  <pub-id pub-id-type="isbn">9780511977930</pub-id>
                </element-citation>
              </ref>
              <ref id="bib8">
                <!-- specific-use="analyzed" for any datasets used but not generated for this work -->
                <element-citation publication-type="data" specific-use="analyzed">
                  <person-group person-group-type="author">
                    <name>
                      <surname>Kok</surname>
                      <given-names>K</given-names>
                    </name>
                    <name>
                      <surname>Ay</surname>
                      <given-names>A</given-names>
                    </name>
                    <name>
                      <surname>Li</surname>
                      <given-names>L</given-names>
                    </name>
                  </person-group>
                  <data-title>Genome-wide errant targeting by Hairy</data-title>
                  <source>Dryad Digital Repository</source>
                    <year iso-8601-date="2015">2015</year>
                  <pub-id pub-id-type="doi">10.5061/dryad.cv323</pub-id>
                </element-citation>
              </ref>
              <ref id="bib9">
                <element-citation publication-type="patent">
                  <person-group person-group-type="inventor">
                    <name>
                      <surname>Onoda</surname>
                      <given-names>T</given-names>
                    </name>
                          ...
                                </person-group>
                  <year iso-8601-date="2015">2015</year>
                  <article-title>Imidazopyridine Derivative</article-title>
                  <source>World Intellectual Property Organization</source>
                  <patent country="Japan">2015087996</patent>
                  <ext-link ext-link-type="uri" xlink:href="https://patents.google.com/patent/WO2015087996A1/en">https://patents.google.com/patent/WO2015087996A1/en</ext-link>
                </element-citation>
              </ref>
              <ref id="bib10">
                <element-citation publication-type="journal">
                  <person-group person-group-type="author">
                    <name>
                      <surname>Paciência</surname>
                      <given-names>F</given-names>
                    </name>
                          ...
                                </person-group>
                  <year iso-8601-date="2019">2019</year>
                  <article-title>Mating avoidance in female olive baboons (<italic>Papio anubis</italic>) infected by Treponema pallidum</article-title>
                  <source>Science Advances</source>
                  <comment>In press</comment>
                </element-citation>
              </ref>
              <ref id="bib11">
                  <element-citation publication-type="software">
                      <person-group person-group-type="author">
                          <collab>R Development core team</collab>
                      </person-group>
                      <year iso-8601-date="2017">2017</year>
                      <article-title>R: a language and environment for statistical computing</article-title>
                      <version designator="3.3.2">3.3.2</version>
                      <publisher-loc>Vienna, Austria</publisher-loc>
                      <publisher-name>R Foundation for Statistical Computing</publisher-name>
                      <ext-link ext-link-type="uri" xlink:href="http://www.r-project.org/">http://www.r-project.org/</ext-link>
                  </element-citation>
              </ref>
              <ref id="bib12">
                <element-citation publication-type="thesis">
                  <person-group person-group-type="author">
                    <name>
                      <surname>Richter</surname>
                      <given-names>DJ</given-names>
                    </name>
                  </person-group>
                  <year iso-8601-date="2013">2013</year>
                  <article-title>The Gene Content of Diverse Choanoflagellates Illuminates Animal Origins</article-title>
                  <publisher-name>University of California, Berkeley</publisher-name>
                  <ext-link ext-link-type="uri" xlink:href="https://escholarship.org/uc/item/7xc2p94p">https://escholarship.org/uc/item/7xc2p94p</ext-link>
                </element-citation>
              </ref>
              <ref id="bib13">
                <element-citation publication-type="confproc">
                  <person-group person-group-type="author">
                    <name>
                      <surname>Spangler</surname>
                      <given-names>S</given-names>
                    </name>
                  </person-group>
                  <year iso-8601-date="2014">2014</year>
                  <article-title>Automated hypothesis generation based on mining scientific literature</article-title>
                  <conf-name>Proceedings of the 20th ACM SIGKDD International Conference on Knowledge Discovery and Data Mining</conf-name>
                  <fpage>1877</fpage>
                  <lpage>1886</lpage>
                  <pub-id pub-id-type="doi">10.1145/2623330.2623667</pub-id>
                </element-citation>
              </ref>
              <ref id="bib14">
                <element-citation publication-type="journal">
                  <person-group person-group-type="author">
                    <name>
                      <surname>Srinivasan</surname>
                      <given-names>S</given-names>
                    </name>
                    ...
                  </person-group>
                  <year iso-8601-date="2019">2019</year>
                  <article-title>A multiphase theory for spreadingmicrobial swarms and films</article-title>
                  <source>eLife</source>
                  <volume>8</volume>
                  <elocation-id>e42697</elocation-id>
                  <pub-id pub-id-type="doi">10.7554/eLife.42697</pub-id>
                  <pub-id pub-id-type="pmid">31038122</pub-id>
                  <!-- Add PMCID -->
                  <pub-id pub-id-type="pmcid">PMC6491038</pub-id>
                </element-citation>
              </ref>
              <ref id="bib15">
                <element-citation publication-type="periodical">
                  <person-group person-group-type="author">
                    <name>
                      <surname>Wahls</surname>
                      <given-names>WP</given-names>
                    </name>
                  </person-group>
                    <!-- iso-8601-date moved from year to string-date -->
                    <string-date iso-8601-date="2016-10-03"><month>October</month> <day>3</day>, <year>2016</year></string-date>
                  <article-title>Send my tax dollars to Mississippi</article-title>
                  <source>ASBMB Today</source>
                  <volume>15</volume>
                  <fpage>24</fpage>
                  <lpage>25</lpage>
                </element-citation>
              </ref>
              <ref id="bib16">
                <element-citation publication-type="report">
                  <person-group person-group-type="author">
                    <collab>World Health Organization</collab>
                  </person-group>
                  <year iso-8601-date="2015">2015</year>
                  <source>World Malaria Report 2015</source>
                  <publisher-loc>Geneva</publisher-loc>
                  <publisher-name>World Health Organization</publisher-name>
                  <ext-link ext-link-type="uri" xlink:href="http://www.who.int/malaria/publications/world-malaria-report-2015/en/">http://www.who.int/malaria/publications/world-malaria-report-2015/en/</ext-link>
                </element-citation>
              </ref>
              <ref id="bib17">
                  <!-- General data repositories can be cited using <ext-link> -->
                  <element-citation publication-type="data" specific-use="analyzed">
                      <person-group person-group-type="author">
                          <name>
                              <surname>Zok</surname>
                              <given-names>K</given-names>
                          </name>
                      </person-group>
                      <data-title>EpiCoV</data-title>
                      <source>GSAID's EpiFlu</source>
                      <year iso-8601-date="2020">2020</year>
                      <ext-link ext-link-type="uri" xlink:href="https://www.gisaid.org/">https://www.gisaid.org/</ext-link>
                  </element-citation>
              </ref>
              <ref id="bib18">
                  <element-citation publication-type="preprint">
                      <person-group person-group-type="author">
                          <name>
                              <surname>Zurray</surname>
                              <given-names>D</given-names>
                          </name>
                      </person-group>
                      <year iso-8601-date="2019">2019</year>
                      <article-title>Gender and international diversity improves equity in peer review</article-title>
                      <source>bioRxiv</source>
                      <pub-id pub-id-type="doi">10.1101/400515</pub-id>
                  </element-citation>
              </ref>
          </ref-list>
          <app-group>
              <app id="appendix-1">
                  <title>Appendix 1</title>
                  <!-- <boxed-text> removed from appendices -->
                  <table-wrap id="app1keyresource" position="anchor">
                      <label>Appendix 1—key resources table</label>
                      <table frame="hsides" rules="groups">
                          <thead>
                              <tr>
                                  <th>Reagent type <break/>(species) or resource</th>
                                  <th>Designation</th>
                                  <th>Source or reference</th>
                                  <th>Identifiers</th>
                                  <th>Additional <break/>information</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr>
                                  <td>gene (<italic>Drosophila melanogaster</italic>)</td>
                                  <td>nito</td>
                                  <td>NA</td>
                                  <td>FLYB:FBgn0027548</td>
                                  <td>&#x00A0;</td>
                              </tr>
                              <tr>
                                  <td>gene (<italic>D. melanogaster</italic>)</td>
                                  <td>Sxl</td>
                                  <td>NA</td>
                                  <td>FLYB:FBgn0264270</td>
                                  <td>&#x00A0;</td>
                              </tr>
                              <tr>
                                  <td>genetic reagent (<italic>D. melanogaster</italic>)</td>
                                  <td>MTD-Gal4</td>
                                  <td>Bloomington Drosophila Stock Center</td>
                                  <!-- https://identifiers.org/RRID/RRID: used for RRIDs instead of https://scicrunch.org/resolver/ -->
                                  <td>BDSC:31777; FLYB:FBtp0001612; RRID:<ext-link ext-link-type="uri" xlink:href="https://identifiers.org/RRID/RRID:BDSC_31777">BDSC_31777</ext-link></td>
                                  <td>FlyBase symbol: P{GAL4-nos.NGT}</td>
                              </tr>
                              <tr>
                                  <td>genetic reagent (<italic>D. melanogaster</italic>)</td>
                                  <td>ap-Gal4</td>
                                  <td>Bloomington Drosophila Stock Center</td>
                                  <td>BDSC:3041; FLYB:FBti0002785; RRID:<ext-link ext-link-type="uri" xlink:href="https://identifiers.org/RRID/RRID:BDSC_3041">BDSC_3041</ext-link></td>
                                  <td>FlyBase symbol: P{GawB}ap[md544]</td>
                              </tr>
                              <tr>
                                  <td>genetic reagent (<italic>D. melanogaster</italic>)</td>
                                  <td>nub-Gal4</td>
                                  <td>PMID:20798049</td>
                                  <td>FLYB:FBti0016825</td>
                                  <td>FlyBase symbol: P{GawB}nubbin-AC-62</td>
                              </tr>
                              <tr>
                                  <td>genetic reagent (<italic>D. melanogaster</italic>)</td>
                                  <td>dome-Gal4</td>
                                  <td>PMID:12403714</td>
                                  <td>FLYB:FBti0022298</td>
                                  <td>FlyBase symbol: P{GawB}dome[PG14]</td>
                              </tr>
                              <tr>
                                  <td>genetic reagent (<italic>D. melanogaster</italic>)</td>
                                  <td>UAS-2xEYFP</td>
                                  <td>PMID:12324968</td>
                                  <td>FLYB:FBtp0016537</td>
                                  <td>FlyBase symbol: P{UAS-2xEYFP}</td>
                              </tr>
                              <tr>
                                  <td>genetic reagent (<italic>D. melanogaster</italic>)</td>
                                  <td>nito[HP25329]</td>
                                  <td>Bloomington Drosophila Stock Center</td>
                                  <td>BDSC:22092; FLYB:FBal0238892; RRID:<ext-link ext-link-type="uri" xlink:href="https://identifiers.org/RRID/RRID:BDSC_22092">BDSC_22092</ext-link></td>
                                  <td>Genotype: w[1118]; P{w[+mC]=EPg}nito[HP25329]/CyO</td>
                              </tr>
                              <tr>
                                  <td>genetic reagent (<italic>D. melanogaster</italic>)</td>
                                  <td>nito[1]</td>
                                  <td>this paper</td>
                                  <td>&#x00A0;</td>
                                  <td>Progenitor = nito[HP25329]; imprecise excision; lethal</td>
                              </tr>
                              <tr>
                                  <td>genetic reagent (<italic>D. melanogaster</italic>)</td>
                                  <td>nito shRNA (HMJ02081)</td>
                                  <td>Bloomington Drosophila Stock Center</td>
                                  <td>TRiP:HMJ02081; BDSC:56852; RRID:<ext-link ext-link-type="uri" xlink:href="https://identifiers.org/RRID/RRID:BDSC_56852">BDSC_56852</ext-link></td>
                                  <td>FlyBase symbol: P{TRiP.HMJ02081}attP40</td>
                              </tr>
                              <tr>
                                  <td>genetic reagent (<italic>D. melanogaster</italic>)</td>
                                  <td>nito dsRNA (VDRC 20942)</td>
                                  <td>Vienna Drosophila RNAi Center</td>
                                  <td>VDRC:20942</td>
                                  <td>&#x00A0;</td>
                              </tr>
                              <tr>
                                  <td>genetic reagent (<italic>D. melanogaster</italic>)</td>
                                  <td>FRT[G13]</td>
                                  <td>Bloomington Drosophila Stock Center</td>
                                  <td>BDSC:1956; FLYB:FBti0001247</td>
                                  <td>FlyBase symbol: P{FRT(whs)}G13</td>
                              </tr>
                              <tr>
                                  <td>genetic reagent (<italic>D. melanogaster</italic>)</td>
                                  <td>"y w hsflp; ubiGFP FRT[G13]"</td>
                                  <td>PMID:18160348</td>
                                  <td>&#x00A0;</td>
                                  <td>&#x00A0;</td>
                              </tr>
                              <tr>
                                  <td>cell line (<italic>D. melanogaster</italic>)</td>
                                  <td>S2</td>
                                  <td>other</td>
                                  <td>FLYB:FBtc0000181; RRID:<ext-link ext-link-type="uri" xlink:href="https://identifiers.org/RRID/RRID:CVCL_Z992">CVCL_Z992</ext-link></td>
                                  <td>Cell line maintained in N. Perrimon lab; FlyBase symbol:
                                      S2-DRSC.</td>
                              </tr>
                              <tr>
                                  <td>antibody</td>
                                  <td>anti-Nito</td>
                                  <td>this paper</td>
                                  <td>&#x00A0;</td>
                                  <td>Rabbit polyclonal; against aa 479-500; used YZ3137 (1:500)</td>
                              </tr>
                              <tr>
                                  <td>antibody</td>
                                  <td>anti-alpha-Spectrin (mouse monoclonal)</td>
                                  <td>Developmental Studies Hybridoma Bank</td>
                                  <td>DSHB:3A9; RRID:<ext-link ext-link-type="uri" xlink:href="https://identifiers.org/RRID/RRID:AB_528473">AB_528473</ext-link></td>
                                  <td>(1:10)</td>
                              </tr>
                              <tr>
                                  <td>antibody</td>
                                  <td>anti-Vasa (rabbit polyclonal)</td>
                                  <td>Santa Cruz Biotechnology</td>
                                  <td>Santa Cruz:sc-30210; RRID:<ext-link ext-link-type="uri" xlink:href="https://identifiers.org/RRID/RRID:AB_793874">AB_793874</ext-link></td>
                                  <td>(1:250)</td>
                              </tr>
                              <tr>
                                  <td>antibody</td>
                                  <td>anti-Sxl (mouse monoclonal)</td>
                                  <td>Developmental Studies Hybridoma Bank</td>
                                  <td>DSHB:M18; RRID:<ext-link ext-link-type="uri" xlink:href="https://identifiers.org/RRID/RRID:AB_528464">AB_528464</ext-link></td>
                                  <td>(1:10)</td>
                              </tr>
                              <tr>
                                  <td>antibody</td>
                                  <td>anti-GFP (rabbit polyclonal)</td>
                                  <td>Molecular Probes</td>
                                  <td>Molecular Probes:A-6455; RRID:<ext-link ext-link-type="uri" xlink:href="https://identifiers.org/RRID/RRID:AB_221570">AB_221570</ext-link></td>
                                  <td>(1:1000)</td>
                              </tr>
                              <tr>
                                  <td>antibody</td>
                                  <td>anti-GFP (mouse monoclonal)</td>
                                  <td>Molecular Probes</td>
                                  <td>Molecular Probes:A-11120; RRID:<ext-link ext-link-type="uri" xlink:href="https://identifiers.org/RRID/RRID:AB_221568">AB_221568</ext-link></td>
                                  <td>(1:200)</td>
                              </tr>
                              <tr>
                                  <td>antibody</td>
                                  <td>anti-HA (rat monoclonal)</td>
                                  <td>Roche</td>
                                  <td>Roche:3F10; RRID:<ext-link ext-link-type="uri" xlink:href="https://identifiers.org/RRID/RRID:AB_2314622">AB_2314622</ext-link></td>
                                  <td>&#x00A0;</td>
                              </tr>
                              <tr>
                                  <td>antibody</td>
                                  <td>Alexa 488- or 555- secondaries</td>
                                  <td>Molecular Probes</td>
                                  <td>&#x00A0;</td>
                                  <td>(1:1000)</td>
                              </tr>
                              <tr>
                                  <td>other</td>
                                  <td>DAPI stain</td>
                                  <td>Molecular Probes</td>
                                  <td>&#x00A0;</td>
                                  <td>(1:1000)</td>
                              </tr>
                              <tr>
                                  <td>recombinant DNA reagent</td>
                                  <td>pAGW (Gateway vector)</td>
                                  <td>Drosophila Genomics Resource Center</td>
                                  <td>DGRC:1071</td>
                                  <td>&#x00A0;</td>
                              </tr>
                              <tr>
                                  <td>recombinant DNA reagent</td>
                                  <td>pAHW (Gateway vector)</td>
                                  <td>Drosophila Genomics Resource Center</td>
                                  <td>DGRC:1095 (<xref ref-type="bibr" rid="bib11">R Development core team, 2017</xref>)</td>
                                  <td>&#x00A0;</td>
                              </tr>
                              <tr>
                                  <td>recombinant DNA reagent</td>
                                  <td>GH11110 (cDNA)</td>
                                  <td>Drosophila Genomics Resource Center</td>
                                  <td>DGRC:5666</td>
                                  <td>&#x00A0;</td>
                              </tr>
                              <tr>
                                  <td>recombinant DNA reagent</td>
                                  <td>GFP-Nito (plasmid)</td>
                                  <td>this paper</td>
                                  <td>&#x00A0;</td>
                                  <td>Progenitors: GH11110 (cDNA); Gateway vector pAGW</td>
                              </tr>
                              <tr>
                                  <td>recombinant DNA reagent</td>
                                  <td>HA-Sxl (plasmid)</td>
                                  <td>PMID:16207758</td>
                                  <td>&#x00A0;</td>
                                  <td>Progentiors: PCR, UAS-Sxl flies; Gateway vector pAHW</td>
                              </tr>
                              <tr>
                                  <td>recombinant DNA reagent</td>
                                  <td>GFP-Sxl (plasmid)</td>
                                  <td>PMID:16207758</td>
                                  <td>&#x00A0;</td>
                                  <td>Progentiors: PCR, UAS-Sxl flies; Gateway vector pAGW</td>
                              </tr>
                          </tbody>
                      </table>
                  </table-wrap>
              </app>
              <app id="appendix-2">
                  <title>Appendix 2</title>
                  <sec id="app2s1">
                      <title>Negotiation</title>
                      <p>... <xref ref-type="fig" rid="app2fig1">Appendix 2&#x2014;figure 1</xref> ...</p>
                      <fig id="app2fig1" position="float">
                          <label>Appendix 2&#x2014;figure 1.</label>
                          <caption>
                              <title>Figure added to demonstrate that not only paragaphs but other forms of
                                  content may be included as a child of the boxed-text.</title>
                              <p>If there is a caption to accompany the title it would display here (<xref ref-type="bibr" rid="bib5">Hao et al., 2020</xref>).</p>
                          </caption>
                          <graphic mimetype="image" mime-subtype="tiff" xlink:href="elife-00666-app2-fig1.tif"/>
                      </fig>
                      <fig id="app2scheme1" position="float">
                          <label>Appendix 2&#x2014;scheme 1.</label>
                          <caption>
                              <title>Scheme title.</title>
                          </caption>
                          <graphic mimetype="image" mime-subtype="tiff" xlink:href="elife-00666-app2-scheme1-fig1.tif"/>
                      </fig>
                      <fig id="app2chem1" position="float">
                          <label>Appendix 2&#x2014;chemical structure 1.</label>
                          <caption>
                              <title>Chemical structure title.</title>
                          </caption>
                          <graphic mimetype="image" mime-subtype="tiff" xlink:href="elife-00666-app2-chem1-fig1.tif"/>
                      </fig>
                      <sec id="app2s2">
                          <title>Appendix heading level 1</title>
                          <p>... <xref ref-type="disp-formula" rid="app2equ1">Equation 1</xref> <disp-formula id="app2equ1">
                              <label>(1)</label>
                              <!-- math id includes app id prefix -->
                                  <mml:math id="app2m1">
                                      <mml:mrow>
                                          <mml:mi>ϕ</mml:mi>
                                          <mml:mo>=</mml:mo>
                                          <mml:msup>
                                              <mml:mi>e</mml:mi>
                                              <mml:mrow>
                                                  <mml:mo>−</mml:mo>
                                                  <mml:mfrac>
                                                      <mml:mrow>
                                                          <mml:mi>z</mml:mi>
                                                          <mml:mi>F</mml:mi>
                                                          <mml:mi>V</mml:mi>
                                                      </mml:mrow>
                                                      <mml:mrow>
                                                          <mml:mi>n</mml:mi>
                                                          <mml:mi>R</mml:mi>
                                                          <mml:mi>T</mml:mi>
                                                      </mml:mrow>
                                                  </mml:mfrac>
                                              </mml:mrow>
                                          </mml:msup>
                                      </mml:mrow>
                                  </mml:math>
                          </disp-formula></p>
                          <sec id="app2s2-1">
                              <title>Appendix heading level 2</title>
                              <p>...</p>
                              <sec id="app2s3">
                                  <title>Appendix heading level 3</title>
                                  <p>...<xref ref-type="bibr" rid="bib5">Hao et al., 2020</xref>... <xref ref-type="bibr" rid="bib5">Hao et al., 2020</xref>...</p>
                                  <!-- Only 4 nested secs allowed in appendices due to h6 limit in HTML
                                      h1 = article title
                                      h2 = appendix title
                                      h3-6 = appendix sections
                                  -->
                                  <sec id="app2s4">
                                      <title>Appendix heading level 4</title>
                                      <p>...</p>
                                  </sec>
                              </sec>
                          </sec>
                      </sec>
                  </sec>
              </app>
              <app id="appendix-3">
                  <title>Appendix 3</title>
                  <p>...</p>
                  <sec id="s9">
                      <title>Section title</title>
                      <p>... <xref ref-type="fig" rid="app3fig1">Appendix 3&#x2014;figure 1</xref> (<xref ref-type="supplementary-material" rid="app3fig1sdata1">Appendix 3&#x2014;figure 1&#x2014;source data 1</xref>; <xref ref-type="supplementary-material" rid="app3fig1sdata2">Appendix 3&#x2014;figure 1&#x2014;source data 2</xref>; <xref ref-type="supplementary-material" rid="app3fig1scode1">Appendix 3&#x2014;figure 1&#x2014;source code 1</xref>).</p>
                      <fig-group>
                          <caption specific-use="print">
                              <p>The online version of this article includes the following video(s), source data, source code, and figure supplement(s) for Appendix 3&#x2014;figure 1:</p>
                          </caption>
                          <fig id="app3fig1" position="float">
                              <label>Appendix 3&#x2014;figure 1.</label>
                              <caption>
                                  <title>Figure title.</title>
                                  <!-- specific-use="part-label" on bold used for semantics. Could be hooked from Libero Editor -->
                                  <p>(<bold specific-use="part-label">A, B</bold>) Dependence of CME on Hip1R. (<bold specific-use="part-label">A</bold>) Simulation varying number of <xref ref-type="list" rid="def3">Hip1R</xref>. (<bold specific-use="part-label">B</bold>) Hip1R knockdown inhibits CME (transferrin uptake) in HeLa cells.. (<bold>C, D</bold>) Capping actin filaments inhibits CME. (<bold specific-use="part-label">C</bold>) Simulation. (<bold specific-use="part-label">D</bold>) Slower assembly and disassembly of endogenous dynamin2-GFP at sites of endocytosis in SK-MEL-2 cells treated with different concentrations of Cytochalasin D. (<bold specific-use="part-label">E, F</bold>) Endocytic actin filaments bend at sites of mammalian endocytosis, tested by cryo-electron tomography of intact mammalian cells. (<bold specific-use="part-label">G, H</bold>) Mammalian CME is sensitive to Arp2/3 complex activity, revealed by treating SK-MEL-2 cells expressing endogenous clathrin and dynamin2 fluorescent tags with the Arp2/3 complex inhibitor CK-666 (<xref ref-type="fig" rid="app3fig1s1">Appendix 3&#x2014;figure 1&#x2014;figure supplement 1</xref>).</p>
                                  <!-- Pending a suspected change in JATS 1.2 supplementary-material could be captured as a child of fig,
                          rather than inside a p in the caption. -->
                                  <p><supplementary-material id="app3fig1sdata1">
                                      <label>Appendix 3&#x2014;figure 1&#x2014;source data 1.</label>
                                      <caption>
                                          <title>Source data title.</title>
                                          <p>Source data caption.</p>
                                      </caption>
                                      <media mime-subtype="docx" mimetype="application" xlink:href="elife-00666-app3-fig1-data1.docx"/>
                                  </supplementary-material></p>
                                  <p>
                                      <supplementary-material id="app3fig1sdata2">
                                          <label>Appendix 3&#x2014;figure 1&#x2014;source data 2.</label>
                                          <caption>
                                              <title>Source data title.</title>
                                              <p>Source data caption.</p>
                                          </caption>
                                          <media mime-subtype="zip" mimetype="application" xlink:href="elife-00666-app3-fig1-data1.zip"/>
                                      </supplementary-material></p>
                                  <p>
                                      <supplementary-material id="app3fig1scode1">
                                          <label>Appendix 3&#x2014;figure 1&#x2014;source code 1.</label>
                                          <caption>
                                              <title>Source code title.</title>
                                              <p>Source code caption.</p>
                                          </caption>
                                          <media mime-subtype="zip" mimetype="application" xlink:href="elife-00666-app3-fig1-code1.zip"/>
                                      </supplementary-material></p>
                              </caption>
                              <graphic mime-subtype="tiff" mimetype="image" xlink:href="elife-00666-app3-fig1.tif"/>
                              <permissions>
                                  <copyright-statement>© 2004, American Society for Cell Biology, All Rights Reserved</copyright-statement>
                                  <copyright-year>2004</copyright-year>
                                  <copyright-holder>American Society for Cell Biology</copyright-holder>
                                  <license>
                                      <license-p>Panel B is reproduced from  with permission. It is not covered by the CC-BY 4.0 licence and further reproduction of this panel would need permission from the copyright holder.</license-p>
                                  </license>
                              </permissions>
                              <permissions>
                                  <copyright-statement>© 2014, copyright holder</copyright-statement>
                                  <copyright-year>2014</copyright-year>
                                  <copyright-holder>copyright holder</copyright-holder>
                                  <license>
                                      <ali:license_ref>https://creativecommons.org/licenses/by-nc-nd/4.0/</ali:license_ref>
                                      <license-p>Panel D is reproduced from ... published under a <ext-link ext-link-type="uri" xlink:href="https://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution License (CC BY-NC-ND 4.0)</ext-link></license-p>
                                  </license>
                              </permissions>
                          </fig>
                          <fig id="app3fig1s1" specific-use="child-fig" position="float">
                              <label>Appendix 3&#x2014;figure 1&#x2014;figure supplement 1.</label>
                              <caption>
                                  <title>Figure supplement title.</title>
                                  <!-- specific-use="part-label" on bold used for semantics. Could be hooked from Libero Editor -->
                                  <p>(<bold specific-use="part-label">A, B</bold>) Dependence of CME on Hip1R. (<bold specific-use="part-label">A</bold>) Simulation varying number of Hip1R. (<bold specific-use="part-label">B</bold>) Hip1R knockdown inhibits CME (transferrin uptake) in HeLa cells.. (<bold>C, D</bold>) Capping actin filaments inhibits CME. (<bold specific-use="part-label">C</bold>) Simulation. (<bold specific-use="part-label">D</bold>) Slower assembly and disassembly of endogenous dynamin2-GFP at sites of endocytosis in SK-MEL-2 cells treated with different concentrations of Cytochalasin D. (<bold specific-use="part-label">E, F</bold>) Endocytic actin filaments bend at sites of mammalian endocytosis, tested by cryo-electron tomography of intact mammalian cells. (<bold specific-use="part-label">G, H</bold>) Mammalian CME is sensitive to Arp2/3 complex activity, revealed by treating SK-MEL-2 cells expressing endogenous clathrin and dynamin2 fluorescent tags with the Arp2/3 complex inhibitor CK-666.</p>
                                  <!-- Pending a suspected change in JATS 1.2 supplementary-material could be captured as a child of fig,
                          rather than inside a p in the caption. -->
                                  <p><supplementary-material id="app3fig1s1sdata1">
                                      <label>Appendix 3&#x2014;figure 1&#x2014;figure supplement 1&#x2014;source data 1.</label>
                                      <caption>
                                          <title>Source data title.</title>
                                          <p>Source data caption.</p>
                                      </caption>
                                      <media mime-subtype="docx" mimetype="application" xlink:href="elife-00666-app3-fig1-figsupp1-data1.docx"/>
                                  </supplementary-material></p>
                                  <p>
                                      <supplementary-material id="app3fig1s1sdata2">
                                          <label>Appendix 3&#x2014;figure 1&#x2014;figure supplement 1&#x2014;source data 2.</label>
                                          <caption>
                                              <title>Source data title.</title>
                                              <p>Source data caption.</p>
                                          </caption>
                                          <media mime-subtype="zip" mimetype="application" xlink:href="elife-00666-app3-fig1-figsup1-data1.zip"/>
                                      </supplementary-material></p>
                                  <p>
                                      <supplementary-material id="app3fig1s1scode1">
                                          <label>Appendix 3&#x2014;figure 1&#x2014;figure supplement 1&#x2014;source code 1.</label>
                                          <caption>
                                              <title>Source code title.</title>
                                              <p>Source code caption.</p>
                                          </caption>
                                          <media mime-subtype="zip" mimetype="application" xlink:href="elife-00666-app3-fig1-figsup1-code1.zip"/>
                                      </supplementary-material></p>
                              </caption>
                              <graphic mime-subtype="tiff" mimetype="image" xlink:href="elife-00666-app3-fig1-figsupp1.tif"/>
                              <permissions>
                                  <copyright-statement>© 2004, American Society for Cell Biology, All Rights Reserved</copyright-statement>
                                  <copyright-year>2004</copyright-year>
                                  <copyright-holder>American Society for Cell Biology</copyright-holder>
                                  <license>
                                      <license-p>Panel B is reproduced from  with permission. It is not covered by the CC-BY 4.0 licence and further reproduction of this panel would need permission from the copyright holder.</license-p>
                                  </license>
                              </permissions>
                              <permissions>
                                  <copyright-statement>© 2014, copyright holder</copyright-statement>
                                  <copyright-year>2014</copyright-year>
                                  <copyright-holder>copyright holder</copyright-holder>
                                  <license>
                                      <ali:license_ref>https://creativecommons.org/licenses/by-nc-nd/4.0/</ali:license_ref>
                                      <license-p>Panel D is reproduced from ... published under a <ext-link ext-link-type="uri" xlink:href="https://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution License (CC BY-NC-ND 4.0)</ext-link></license-p>
                                  </license>
                              </permissions>
                          </fig>
                          <media id="app3fig1video1" mime-subtype="mp4" mimetype="video" xlink:href="elife-00666-app3-fig1-video1.mp4">
                              <label>Appendix 3&#x2014;figure 2&#x2014;video 1.</label>
                              <caption>
                                  <title>TIRF force reconstitution assay of wild-type vinculin ABD.</title>
                                  <p>First 100 s of representative ... Scale bar, 20 µm.</p>
                              </caption>
                          </media>
                      </fig-group>
                  </sec>
              </app>
          </app-group>
      </back>
      <!-- article-type changed from decision-letter to referee-report -->
      <sub-article id="sa1" article-type="referee-report">
          <front-stub>
              <article-id pub-id-type="doi">10.7554/eLife.00666.sa1</article-id>
              <title-group>
                  <article-title>Decision letter</article-title>
              </title-group>
              <contrib-group>
                  <!-- contrib-type changed to author -->
                  <contrib contrib-type="author">
                      <name>
                          <surname>Helaine</surname>
                          <given-names>Sophie</given-names>
                      </name>
                      <!-- role element added with appropriate specific-use attribute value -->
                      <role specific-use="editor">Reviewing Editor</role>
                      <contrib-id contrib-id-type="orcid">https://orcid.org/0000-0000-0404-000X</contrib-id>
                      <aff>
                          <!-- ROR ids also permitted here -->
                          <institution-wrap>
                              <institution-id institution-id-type="ror">https://ror.org/041kmwe10</institution-id>
                              <institution>Imperial College London</institution>
                          </institution-wrap>
                          <country country="GB">United Kingdom</country>
                      </aff>
                  </contrib>
              </contrib-group>
              <contrib-group>
                  <!-- contrib-type changed to author -->
                  <contrib contrib-type="author">
                      <name><surname>Taylor</surname><given-names>J Paul</given-names></name>
                      <!-- role element added with appropriate specific-use attribute value -->
                      <role specific-use="referee">Reviewer</role>
                      <contrib-id contrib-id-type="orcid">https://orcid.org/0070-0001-0404-000X</contrib-id>
                      <aff>
                          <institution>St Jude Children's Research Hospital</institution>
                          <country country="US">United States</country>
                      </aff>
                  </contrib>
                  <!-- Each anonymous reviewer is still added -->
                  <contrib contrib-type="author">
                      <anonymous/>
                      <role specific-use="referee">Reviewer</role>
                  </contrib>
                  <contrib contrib-type="author">
                      <anonymous/>
                      <role specific-use="referee">Reviewer</role>
                  </contrib>
              </contrib-group>
              <custom-meta-group>
                  <!-- custom-meta to indicate that this decision letter was transferred from elsewhere -->
                  <custom-meta>
                      <meta-name>transferred-from</meta-name>
                      <meta-value>Review Commons</meta-value>
                  </custom-meta>
                  <!-- custom-meta to indicate decision -->
                  <custom-meta>
                      <meta-name>peer-review-recommendation</meta-name>
                      <meta-value>accept-in-principle</meta-value>
                  </custom-meta>
                  <!-- custom-meta to indicate peer review type -->
                  <custom-meta>
                      <meta-name>PeerReviewType</meta-name>
                      <meta-value>visible</meta-value>
                  </custom-meta>
              </custom-meta-group>
          </front-stub>
          <body>
              <boxed-text>
                  <p>In the interests of transparency, eLife publishes the most substantive revision requests and the accompanying author responses.</p>
              </boxed-text>
              <p>[Editors' note: this paper was reviewed by <ext-link ext-link-type="uri" xlink:href="https://www.reviewcommons.org/">Review Commons</ext-link>.]</p>
              <p><bold>Acceptance summary:</bold></p>
              <p>This paper combines two complementary approaches, translating ribosome affinity purification (TRAP) and ribosome profiling, to provide the first quantitative insight into the impact of PrP<sup>Sc</sup> on cell type-specific translation. Surprisingly few translational changes were detected in neurons. In contrast, substantial alterations to translation were evident in astrocytes and microglia prior to manifestation of prion disease features, suggesting that aberrant translation in these cell types may be a primary driver of neurodegeneration.</p>
              <p>The reviewers have discussed the reviews with one another and the Reviewing Editor has drafted this decision to help you prepare a revised submission.</p>
              <p>You need to make sure the XML structure you create works on the display of the PMC platform and also that there is enough  information contained within the tagging to generate a typeset PDF from the XML with no additional information provided. See <xref ref-type="fig" rid="sa1fig1">Decision letter image 1.</xref>, <xref ref-type="table" rid="sa1table1">Decision letter table 1</xref> and <xref ref-type="video" rid="sa1video1">Decision letter video 1</xref>.</p>
              <fig id="sa1fig1" position="float">
                  <label>Decision letter image 1.</label>
                  <caption>
                      <p>Single figure: The header of an eLife article example on the HTML page.</p>
                  </caption>
                  <graphic mimetype="image" mime-subtype="tiff" xlink:href="elife-00666-sa1-fig1.tif"/>
              </fig>
              <table-wrap id="sa1table1" position="float">
                  <label>Decision letter table 1.</label>
                  <caption>
                      <p>Decision letter table.</p>
                  </caption>
                  <table frame="hsides" rules="groups">
                      <thead>
                          <tr>
                              <th>Sample</th>
                              <th>Same</th>
                              <th>Difference more than 10%</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td>DKO1.cell.1</td>
                              <td>77.00%</td>
                              <td>6.90%</td>
                          </tr>
                          <tr>
                              <td>DKO1.cell.2</td>
                              <td>78.80%</td>
                              <td>7.20%</td>
                          </tr>
                          <tr>
                              <td>DKO1.cell.3</td>
                              <td>79.10%</td>
                              <td>6.70%</td>
                          </tr>
                          <tr>
                              <td>DKO1.exo.1</td>
                              <td>78.90%</td>
                              <td>6.50%</td>
                          </tr>
                          <tr>
                              <td>DKO1.exo.2</td>
                              <td>80.00%</td>
                              <td>5.80%</td>
                          </tr>
                          <tr>
                              <td>DKO1.exo.3</td>
                              <td>86.80%</td>
                              <td>2.30%</td>
                          </tr>
                          <tr>
                              <td>DKS8.cell.1</td>
                              <td>77.30%</td>
                              <td>7.80%</td>
                          </tr>
                          <tr>
                              <td>DKS8.cell.2</td>
                              <td>79.70%</td>
                              <td>6.70%</td>
                          </tr>
                      </tbody>
                  </table>
              </table-wrap>
              <media mimetype="video" mime-subtype="mp4" id="sa1video1" xlink:href="elife-00666-sa1-video1.mp4">
                  <label>Decision letter video 1.</label>
                  <caption>
                      <title>Caption and/or a title is required.</title>
                  </caption>
              </media>
              <p>Adding some MathML to the sub-article.<inline-formula>
                  <mml:math id="sa1m1">
                      <mml:mstyle displaystyle="true" scriptlevel="0">
                          <mml:mrow>
                              <mml:msup>
                                  <mml:mi>F</mml:mi>
                                  <mml:mrow>
                                      <mml:mi>A</mml:mi>
                                      <mml:mi>B</mml:mi>
                                  </mml:mrow>
                              </mml:msup>
                              <mml:mo>∼</mml:mo>
                              <mml:mfrac>
                                  <mml:msubsup>
                                      <mml:mi>k</mml:mi>
                                      <mml:mrow>
                                          <mml:mi>f</mml:mi>
                                      </mml:mrow>
                                      <mml:mrow>
                                          <mml:mi>A</mml:mi>
                                          <mml:mi>B</mml:mi>
                                      </mml:mrow>
                                  </mml:msubsup>
                                  <mml:msqrt>
                                      <mml:msubsup>
                                          <mml:mi>k</mml:mi>
                                          <mml:mrow>
                                              <mml:mi>f</mml:mi>
                                          </mml:mrow>
                                          <mml:mrow>
                                              <mml:mi>A</mml:mi>
                                              <mml:mi>A</mml:mi>
                                          </mml:mrow>
                                      </mml:msubsup>
                                      <mml:msubsup>
                                          <mml:mi>k</mml:mi>
                                          <mml:mrow>
                                              <mml:mi>f</mml:mi>
                                          </mml:mrow>
                                          <mml:mrow>
                                              <mml:mi>B</mml:mi>
                                              <mml:mi>B</mml:mi>
                                          </mml:mrow>
                                      </mml:msubsup>
                                  </mml:msqrt>
                              </mml:mfrac>
                              <mml:msqrt>
                                  <mml:msup>
                                      <mml:mi>F</mml:mi>
                                      <mml:mrow>
                                          <mml:mi>A</mml:mi>
                                          <mml:mi>A</mml:mi>
                                      </mml:mrow>
                                  </mml:msup>
                                  <mml:msup>
                                      <mml:mi>F</mml:mi>
                                      <mml:mrow>
                                          <mml:mi>B</mml:mi>
                                          <mml:mi>B</mml:mi>
                                      </mml:mrow>
                                  </mml:msup>
                              </mml:msqrt>
                          </mml:mrow>
                      </mml:mstyle>
                  </mml:math>
              </inline-formula>
              </p>
              <p>May also contain a formula as a block
                  <disp-formula id="sa1equ1">
                      <label>(1)</label>
                          <mml:math id="sa1m2">
                              <mml:mstyle displaystyle="true" scriptlevel="0">
                                  <mml:mrow>
                                      <mml:mi>d</mml:mi>
                                      <mml:mtext> </mml:mtext>
                                      <mml:mo>=</mml:mo>
                                      <mml:mtext> </mml:mtext>
                                      <mml:msqrt>
                                          <mml:msup>
                                              <mml:mrow>
                                                  <mml:mo>(</mml:mo>
                                                  <mml:mfrac>
                                                      <mml:mrow>
                                                          <mml:mi>P</mml:mi>
                                                          <mml:mi>r</mml:mi>
                                                          <mml:mi>e</mml:mi>
                                                          <mml:mi>d</mml:mi>
                                                          <mml:mi>i</mml:mi>
                                                          <mml:mi>c</mml:mi>
                                                          <mml:mi>t</mml:mi>
                                                          <mml:mi>e</mml:mi>
                                                          <mml:mi>d</mml:mi>
                                                          <mml:mtext> </mml:mtext>
                                                          <mml:mi>c</mml:mi>
                                                          <mml:mi>o</mml:mi>
                                                          <mml:mi>u</mml:mi>
                                                          <mml:mi>n</mml:mi>
                                                          <mml:msub>
                                                              <mml:mi>t</mml:mi>
                                                              <mml:mrow>
                                                                  <mml:mi mathvariant="bold-italic">i</mml:mi>
                                                                  <mml:mtext> </mml:mtext>
                                                              </mml:mrow>
                                                          </mml:msub>
                                                          <mml:mo>−</mml:mo>
                                                          <mml:mtext> </mml:mtext>
                                                          <mml:mi>O</mml:mi>
                                                          <mml:mi>b</mml:mi>
                                                          <mml:mi>s</mml:mi>
                                                          <mml:mi>e</mml:mi>
                                                          <mml:mi>r</mml:mi>
                                                          <mml:mi>v</mml:mi>
                                                          <mml:mi>e</mml:mi>
                                                          <mml:mi>d</mml:mi>
                                                          <mml:mtext> </mml:mtext>
                                                          <mml:mi>c</mml:mi>
                                                          <mml:mi>o</mml:mi>
                                                          <mml:mi>u</mml:mi>
                                                          <mml:mi>n</mml:mi>
                                                          <mml:msub>
                                                              <mml:mi>t</mml:mi>
                                                              <mml:mrow>
                                                                  <mml:mi>i</mml:mi>
                                                              </mml:mrow>
                                                          </mml:msub>
                                                      </mml:mrow>
                                                      <mml:mrow>
                                                          <mml:mi>O</mml:mi>
                                                          <mml:mi>b</mml:mi>
                                                          <mml:mi>s</mml:mi>
                                                          <mml:mi>e</mml:mi>
                                                          <mml:mi>r</mml:mi>
                                                          <mml:mi>v</mml:mi>
                                                          <mml:mi>e</mml:mi>
                                                          <mml:mi>d</mml:mi>
                                                          <mml:mtext> </mml:mtext>
                                                          <mml:mi>c</mml:mi>
                                                          <mml:mi>o</mml:mi>
                                                          <mml:mi>u</mml:mi>
                                                          <mml:mi>n</mml:mi>
                                                          <mml:msub>
                                                              <mml:mi>t</mml:mi>
                                                              <mml:mrow>
                                                                  <mml:mi>i</mml:mi>
                                                              </mml:mrow>
                                                          </mml:msub>
                                                      </mml:mrow>
                                                  </mml:mfrac>
                                                  <mml:mo>)</mml:mo>
                                              </mml:mrow>
                                              <mml:mrow>
                                                  <mml:mn>2</mml:mn>
                                              </mml:mrow>
                                          </mml:msup>
                                      </mml:msqrt>
                                  </mml:mrow>
                              </mml:mstyle>
                          </mml:math>
                  </disp-formula>
              </p>
              <list id="sa1list1" list-type="order">
                  <list-item>
                      <p>'Contamination'</p>
                      <list id="sa1list2" list-type="roman-lower">
                          <list-item>
                              <p>Cell line <sup>superscript</sup><sub>subscript</sub> &amp; p&lt;0.001</p>
                          </list-item>
                          <list-item>
                              <p><italic>C. elegans</italic></p>
                          </list-item>
                      </list>
                  </list-item>
              </list>
          </body>
      </sub-article>
      <!-- article-type changed from reply to author-comment -->
      <sub-article article-type="author-comment" id="sa2">
          <front-stub>
              <article-id pub-id-type="doi">10.7554/eLife.00666.sa2</article-id>
              <title-group>
                  <article-title>Author response</article-title>
              </title-group>
              <contrib-group>
                  <contrib contrib-type="author">
                      <name>
                          <surname>Atherden</surname>
                          <given-names>Frederick Peter</given-names>
                          <suffix>III</suffix>
                      </name>
                      <role specific-use="author">Author</role>
                  </contrib>
                  <contrib contrib-type="author">
                      <name>
                          <surname>Harrison</surname>
                          <given-names>Melissa</given-names>
                      </name>
                      <role specific-use="author">Author</role>
                  </contrib>
                  <contrib contrib-type="author">
                      <collab>Example Group author
                          <contrib-group content-type="group-members">
                              <contrib contrib-type="author">
                                  <name>
                                      <surname>Gilbert</surname>
                                      <given-names>James</given-names>
                                  </name>
                              </contrib>
                          </contrib-group>
                      </collab>
                      <role specific-use="author">Author</role>
                  </contrib>
                  <contrib contrib-type="author">
                      <name>
                          <surname>Claus</surname>
                          <given-names>Santa</given-names>
                      </name>
                      <role specific-use="author">Author</role>
                  </contrib>
                  <contrib contrib-type="author">
                      <name>
                          <surname>West</surname>
                          <given-names>Cornel</given-names>
                          <suffix>Jnr</suffix>
                      </name>
                      <role specific-use="author">Author</role>
                  </contrib>
                  <on-behalf-of>on behalf of whoever finds this interesting</on-behalf-of>
              </contrib-group>
          </front-stub>
          <body>
              <p>We thank the reviewers for the positive assessment of our work and their insightful remarks. Please find below a point-by-point response to each comment.</p>
              <disp-quote content-type="editor-comment">
                  <p>Reviewer #1 (Evidence, reproducibility and clarity):</p>
                  <p>Scheckel et al. report a large dataset on cell type-specific translational profiling of PrD-associated molecular alterations in a mouse model thorough RiboTRAP and ribosome profiling approaches. They report a more severe alteration in the translatome specifically in astrocyte and microglia as compared to neuronal populations. This highlights that changes in these two cell classes might have a predominant role in the pathology of PrD.</p>
                  <p>Data and the methods are presented such that they can be reproduced. The data analysis section of the manuscript could be further elaborated. In particular, it could be clarified which/how comparisons with existing dataset have been performed. Statistical analysis description is sometimes missing (e.g. Figure 6E, not clear what the stars on top of the bars stands for, which test was performed and the significance). Moreover, the section of the Materials and methods regarding the western blots presented in Figure 6 appear to be missing.</p></disp-quote>
              <p>Figure 6E shows the output (log2 fold change) of DESeq2. Genes with a Benjamini-Hochberg adjusted p value &lt; 0.05 (also derived from DESeq2) are marked with an asterisk. We have added this information to the legend, as well as methods regarding western blots.</p>
              <disp-quote content-type="editor-comment">
                  <p>The reviewers have discussed the reviews with one another and the Reviewing Editor has drafted this decision to help you prepare a revised submission.</p>
                  <p>You need to make sure the XML structure you create works on the display of the PMC platform and also that there is enough information contained within the tagging to generate a typeset PDF from the XML with no additional information provided.</p>
              </disp-quote>
              <p>In response to this comment, we validated the XML against the DTD (JATS 1) each time we made an update. We also regularly used the PMC validator to check our decisions against display on the PMC site, see <xref ref-type="fig" rid="sa2fig1">Author response image 1.</xref>,  <xref ref-type="video" rid="sa2video1">Author response video 1</xref> and <xref ref-type="table" rid="sa2table1">Author response table 1</xref>.</p>
              <fig id="sa2fig1" position="float">
                  <label>Author response image 1.</label>
                  <caption>
                      <p>Single figure: The header of an eLife article example on the HTML page.</p>
                  </caption>
                  <graphic mimetype="image" mime-subtype="tiff" xlink:href="elife-00666-sa2-fig1.tif"/>
              </fig>
              <table-wrap id="sa2table1" position="float">
                  <label>Author response table 1.</label>
                  <caption>
                      <p>Author response table</p>
                  </caption>
                  <table frame="hsides" rules="groups">
                      <thead>
                          <tr>
                              <th>Sample</th>
                              <th>Same</th>
                              <th>Difference more than 10%</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td>DKO1.cell.1</td>
                              <td>77.00%</td>
                              <td>6.90%</td>
                          </tr>
                          <tr>
                              <td>DKO1.cell.2</td>
                              <td>78.80%</td>
                              <td>7.20%</td>
                          </tr>
                          <tr>
                              <td>DKO1.cell.3</td>
                              <td>79.10%</td>
                              <td>6.70%</td>
                          </tr>
                          <tr>
                              <td>DKO1.exo.1</td>
                              <td>78.90%</td>
                              <td>6.50%</td>
                          </tr>
                          <tr>
                              <td>DKO1.exo.2</td>
                              <td>80.00%</td>
                              <td>5.80%</td>
                          </tr>
                          <tr>
                              <td>DKO1.exo.3</td>
                              <td>86.80%</td>
                              <td>2.30%</td>
                          </tr>
                          <tr>
                              <td>DKS8.cell.1</td>
                              <td>77.30%</td>
                              <td>7.80%</td>
                          </tr>
                          <tr>
                              <td>DKS8.cell.2</td>
                              <td>79.70%</td>
                              <td>6.70%</td>
                          </tr>
                      </tbody>
                  </table>
              </table-wrap>
              <media mimetype="video" mime-subtype="mp4" id="sa2video1" xlink:href="elife-00666-sa2-video1.mp4">
                  <label>Author response video 1.</label>
                  <caption>
                      <title>Caption and/or a title is required for all author response assets.</title>
                  </caption>
              </media>
              <p>However, some decisions required some communication with PMC to discuss whether any of our updates could be accomodated by them - during this review we aimed to reduce the complexity of the XML structure and remove all  formatting and bioler plate text required for a PDF display format. We also produced buisness rules {Insert table} order to produce rules for the  production systems and the website to follow. These buisness rules also informed the basis for a set of Schematron rules for our references.</p>
              <p>Adding some MathML to the sub-article.<inline-formula>
                  <mml:math id="sa2m1">
                      <mml:mstyle displaystyle="true" scriptlevel="0">
                          <mml:mrow>
                              <mml:msup>
                                  <mml:mi>F</mml:mi>
                                  <mml:mrow>
                                      <mml:mi>A</mml:mi>
                                      <mml:mi>B</mml:mi>
                                  </mml:mrow>
                              </mml:msup>
                              <mml:mo>∼</mml:mo>
                              <mml:mfrac>
                                  <mml:msubsup>
                                      <mml:mi>k</mml:mi>
                                      <mml:mrow>
                                          <mml:mi>f</mml:mi>
                                      </mml:mrow>
                                      <mml:mrow>
                                          <mml:mi>A</mml:mi>
                                          <mml:mi>B</mml:mi>
                                      </mml:mrow>
                                  </mml:msubsup>
                                  <mml:msqrt>
                                      <mml:msubsup>
                                          <mml:mi>k</mml:mi>
                                          <mml:mrow>
                                              <mml:mi>f</mml:mi>
                                          </mml:mrow>
                                          <mml:mrow>
                                              <mml:mi>A</mml:mi>
                                              <mml:mi>A</mml:mi>
                                          </mml:mrow>
                                      </mml:msubsup>
                                      <mml:msubsup>
                                          <mml:mi>k</mml:mi>
                                          <mml:mrow>
                                              <mml:mi>f</mml:mi>
                                          </mml:mrow>
                                          <mml:mrow>
                                              <mml:mi>B</mml:mi>
                                              <mml:mi>B</mml:mi>
                                          </mml:mrow>
                                      </mml:msubsup>
                                  </mml:msqrt>
                              </mml:mfrac>
                              <mml:msqrt>
                                  <mml:msup>
                                      <mml:mi>F</mml:mi>
                                      <mml:mrow>
                                          <mml:mi>A</mml:mi>
                                          <mml:mi>A</mml:mi>
                                      </mml:mrow>
                                  </mml:msup>
                                  <mml:msup>
                                      <mml:mi>F</mml:mi>
                                      <mml:mrow>
                                          <mml:mi>B</mml:mi>
                                          <mml:mi>B</mml:mi>
                                      </mml:mrow>
                                  </mml:msup>
                              </mml:msqrt>
                          </mml:mrow>
                      </mml:mstyle>
                  </mml:math>
              </inline-formula>
              </p>
              <p>May also contain a formula as a block
                  <disp-formula id="sa2equ1">
                      <label>(1)</label>
                          <mml:math id="sa2m2">
                              <mml:mstyle displaystyle="true" scriptlevel="0">
                                  <mml:mrow>
                                      <mml:mi>d</mml:mi>
                                      <mml:mtext> </mml:mtext>
                                      <mml:mo>=</mml:mo>
                                      <mml:mtext> </mml:mtext>
                                      <mml:msqrt>
                                          <mml:msup>
                                              <mml:mrow>
                                                  <mml:mo>(</mml:mo>
                                                  <mml:mfrac>
                                                      <mml:mrow>
                                                          <mml:mi>P</mml:mi>
                                                          <mml:mi>r</mml:mi>
                                                          <mml:mi>e</mml:mi>
                                                          <mml:mi>d</mml:mi>
                                                          <mml:mi>i</mml:mi>
                                                          <mml:mi>c</mml:mi>
                                                          <mml:mi>t</mml:mi>
                                                          <mml:mi>e</mml:mi>
                                                          <mml:mi>d</mml:mi>
                                                          <mml:mtext> </mml:mtext>
                                                          <mml:mi>c</mml:mi>
                                                          <mml:mi>o</mml:mi>
                                                          <mml:mi>u</mml:mi>
                                                          <mml:mi>n</mml:mi>
                                                          <mml:msub>
                                                              <mml:mi>t</mml:mi>
                                                              <mml:mrow>
                                                                  <mml:mi mathvariant="bold-italic">i</mml:mi>
                                                                  <mml:mtext> </mml:mtext>
                                                              </mml:mrow>
                                                          </mml:msub>
                                                          <mml:mo>−</mml:mo>
                                                          <mml:mtext> </mml:mtext>
                                                          <mml:mi>O</mml:mi>
                                                          <mml:mi>b</mml:mi>
                                                          <mml:mi>s</mml:mi>
                                                          <mml:mi>e</mml:mi>
                                                          <mml:mi>r</mml:mi>
                                                          <mml:mi>v</mml:mi>
                                                          <mml:mi>e</mml:mi>
                                                          <mml:mi>d</mml:mi>
                                                          <mml:mtext> </mml:mtext>
                                                          <mml:mi>c</mml:mi>
                                                          <mml:mi>o</mml:mi>
                                                          <mml:mi>u</mml:mi>
                                                          <mml:mi>n</mml:mi>
                                                          <mml:msub>
                                                              <mml:mi>t</mml:mi>
                                                              <mml:mrow>
                                                                  <mml:mi>i</mml:mi>
                                                              </mml:mrow>
                                                          </mml:msub>
                                                      </mml:mrow>
                                                      <mml:mrow>
                                                          <mml:mi>O</mml:mi>
                                                          <mml:mi>b</mml:mi>
                                                          <mml:mi>s</mml:mi>
                                                          <mml:mi>e</mml:mi>
                                                          <mml:mi>r</mml:mi>
                                                          <mml:mi>v</mml:mi>
                                                          <mml:mi>e</mml:mi>
                                                          <mml:mi>d</mml:mi>
                                                          <mml:mtext> </mml:mtext>
                                                          <mml:mi>c</mml:mi>
                                                          <mml:mi>o</mml:mi>
                                                          <mml:mi>u</mml:mi>
                                                          <mml:mi>n</mml:mi>
                                                          <mml:msub>
                                                              <mml:mi>t</mml:mi>
                                                              <mml:mrow>
                                                                  <mml:mi>i</mml:mi>
                                                              </mml:mrow>
                                                          </mml:msub>
                                                      </mml:mrow>
                                                  </mml:mfrac>
                                                  <mml:mo>)</mml:mo>
                                              </mml:mrow>
                                              <mml:mrow>
                                                  <mml:mn>2</mml:mn>
                                              </mml:mrow>
                                          </mml:msup>
                                      </mml:msqrt>
                                  </mml:mrow>
                              </mml:mstyle>
                          </mml:math>
                  </disp-formula>
              </p>
              <list id="sa2list1" list-type="roman-upper">
                  <list-item>
                      <p>'Contamination'</p>
                      <list id="sa2list2" list-type="order">
                          <list-item>
                              <p>Cell line <sup>superscript</sup><sub>subscript</sub> &amp; p&lt;0.001</p>
                          </list-item>
                          <list-item>
                              <p><italic>C. elegans</italic> is ...</p>
                          </list-item>
                      </list>
                  </list-item>
              </list>
          </body>
      </sub-article>
  </article>`,
  articleId: '54296',
  version: 'r1',
  datatype: "xml",
  fileName: 'elife-54296-vor-r1.xml',
};
export default data;