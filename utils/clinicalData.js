// Helper for selecting at random from enums
const chooseOne = array => {
  const choice = Math.floor(Math.random() * array.length);
  return array[choice];
};

const registrationRecord = (shortName, count) => {
  const donorId = `do-${shortName}-${count}`;
  const gender = Math.random() > 0.5 ? 'Male' : 'Female';
  const specimenId = `sp-${shortName}-${count}`;
  const source = chooseOne([
    'Blood derived',
    'Blood derived - bone marrow',
    'Blood derived - peripheral blood',
    'Bone marrow',
    'Buccal cell',
    'Lymph node',
    'Solid tissue',
    'Plasma',
    'Serum',
    'Urine',
    'Cerebrospinal fluid',
    'Sputum',
    'Other',
    'Pleural effusion',
    'Mononuclear cells from bone marrow',
    'Saliva',
    'Skin',
  ]);
  const normalDesignation = count % 2 === 0 ? 'Normal' : 'Tumour';
  const specimenType = chooseOne([
    'Normal',
    'Normal - tissue adjacent to primary tumour',
    'Primary tumour',
    'Primary tumour - adjacent to normal',
    'Primary tumour - additional new primary',
    'Recurrent tumour',
    'Metastatic tumour',
    'Metastatic tumour - metastasis local to lymph node',
    'Metastatic tumour - metastasis to distant location',
    'Metastatic tumour - additional metastatic',
    'Xenograft - derived from primary tumour',
    'Xenograft - derived from tumour cell line',
    'Cell line - derived from xenograft tumour',
    'Cell line - derived from tumour',
    'Cell line - derived from normal',
  ]);
  const sampleId = `sa-${shortName}-${count}`;
  const sampleType = chooseOne([
    'Total DNA',
    'Amplified DNA',
    'ctDNA',
    'Other DNA enrichments',
    'Total RNA',
    'Ribo-Zero RNA',
    'polyA+ RNA',
    'Other RNA fractions',
  ]);
  return `${shortName}\t${donorId}\t${gender}\t${specimenId}\t${source}\t${normalDesignation}\t${specimenType}\t${sampleId}\t${sampleType}`;
};

const generateRegistrationFile = ({ shortName, count, submitterIdStart = 0 }) => {
  const headers = `program_id\tsubmitter_donor_id\tgender\tsubmitter_specimen_id\tspecimen_tissue_source\ttumour_normal_designation\tsubmitter_sample_id\tsample_type\n`;
  const records = [];
  for (let i = 0; i < count; i++) {
    records.push(registrationRecord(shortName, i + submitterIdStart));
  }
  const data = headers.concat(records.join('\n'));

  return data;
};

const donorRecord = (shortName, count) => {
  const donorId = `do-${shortName}-${count}`;
  const deceased = Math.random() > 0.5 ? true : false;
  const vitalStatus = deceased ? 'Deceased' : chooseOne(['Alive', 'Not reported', 'Unknown']);
  const causeOfDeath = deceased
    ? chooseOne(['Died of cancer', 'Died of other reasons', 'Not reported', 'Unknown'])
    : '';
  const survivalTime = deceased ? Math.floor(Math.random() * 20000) + 600 : '';
  return `${donorId}\t${vitalStatus}\t${causeOfDeath}\t${survivalTime}`;
};

const generateDonorFile = ({ shortName, count, submitterIdStart = 0 }) => {
  const headers = `submitter_donor_id\tvital_status\tcause_of_death\tsurvival_time\n`;
  const records = [];
  for (let i = 0; i < count; i++) {
    records.push(donorRecord(shortName, i + submitterIdStart));
  }
  const data = headers.concat(records.join('\n'));

  return data;
};

const specimenRecord = (shortName, count, donorId, maxInterval = 600) => {
  const specimenId = `sp-${shortName}-${count}`;
  const acquisitionInterval = Math.floor(Math.random() * maxInterval * 0.9) + 1;
  const location = chooseOne([
    'Abdomen',
    'Abdominal wall',
    'Acetabulum',
    'Adenoid',
    'Adipose',
    'Adrenal',
    'Adrenal gland',
    'Alveolar ridge',
    'Amniotic fluid',
    'Ampulla of Vater',
    'Anal sphincter',
    'Ankle',
    'Anorectum',
    'Antecubital fossa',
    'Antrum',
    'Anus',
    'Aorta',
    'Aortic body',
    'Appendix',
    'Aqueous fluid',
    'Arm',
    'Artery',
    'Ascending colon',
    'Ascending colon hepatic flexure',
    'Ascites',
    'Auditory canal',
    'Autonomic nervous system',
    'Axilla',
    'Back',
    'Bile duct',
    'Bladder',
    'Blood',
    'Blood vessel',
    'Bone',
    'Bone marrow',
    'Bowel',
    'Brain',
    'Brain stem',
    'Breast',
    'Broad ligament',
    'Bronchiole',
    'Bronchus',
    'Brow',
    'Buccal cavity',
    'Buccal mucosa',
    'Buttock',
    'Calf',
    'Capillary',
    'Cardia',
    'Carina',
    'Carotid artery',
    'Carotid body',
    'Cartilage',
    'Cecum',
    'Cell-line',
    'Central nervous system',
    'Cerebellum',
    'Cerebral cortex',
    'Cerebrospinal fluid',
    'Cerebrum',
    'Cervical spine',
    'Cervix',
    'Chest',
    'Chest wall',
    'Chin',
    'Clavicle',
    'Clitoris',
    'CNS/spinal',
    'Colon',
    'Colon - mucosa only',
    'Colorectal',
    'Common duct',
    'Conjunctiva',
    'Connective tissue',
    'Dermal',
    'Descending colon',
    'Diaphragm',
    'Duodenum',
    'Ear',
    'Ear canal',
    'Ear, pinna (external)',
    'Effusion',
    'Elbow',
    'Endocrine gland',
    'Epididymis',
    'Epidural space',
    'Esophageal; distal',
    'Esophageal; mid',
    'Esophageal; proximal',
    'Esophagogastric junction',
    'Esophagus',
    'Esophagus - mucosa only',
    'Eye',
    'Fallopian tube',
    'Femoral artery',
    'Femoral vein',
    'Femur',
    'Fibroblasts',
    'Fibula',
    'Finger',
    'Floor of mouth',
    'Fluid',
    'Foot',
    'Forearm',
    'Forehead',
    'Foreskin',
    'Frontal cortex',
    'Frontal lobe',
    'Fundus of stomach',
    'Gallbladder',
    'Ganglia',
    'Gastroesophageal junction',
    'Gastrointestinal tract',
    'Groin',
    'Gum',
    'Hand',
    'Hard palate',
    'Head - face or neck, NOS',
    'Head and neck',
    'Heart',
    'Hepatic',
    'Hepatic duct',
    'Hepatic flexure',
    'Hepatic vein',
    'Hip',
    'Hippocampus',
    'Humerus',
    'Hypopharynx',
    'Ileum',
    'Ilium',
    'Index finger',
    'Ischium',
    'Islet cells',
    'Jaw',
    'Jejunum',
    'Joint',
    'Kidney',
    'Knee',
    'Lacrimal gland',
    'Large bowel',
    'Laryngopharynx',
    'Larynx',
    'Leg',
    'Leptomeninges',
    'Ligament',
    'Lip',
    'Liver',
    'Lumbar spine',
    'Lung',
    'Lymph node',
    'Lymph node(s) axilla',
    'Lymph node(s) cervical',
    'Lymph node(s) distant',
    'Lymph node(s) epitrochlear',
    'Lymph node(s) femoral',
    'Lymph node(s) hilar',
    'Lymph node(s) iliac-common',
    'Lymph node(s) iliac-external',
    'Lymph node(s) inguinal',
    'Lymph node(s) internal mammary',
    'Lymph node(s) mammary',
    'Lymph node(s) mesenteric',
    'Lymph node(s) occipital',
    'Lymph node(s) paraaortic',
    'Lymph node(s) parotid',
    'Lymph node(s) pelvic',
    'Lymph node(s) popliteal',
    'Lymph node(s) regional',
    'Lymph node(s) retroperitoneal',
    'Lymph node(s) scalene',
    'Lymph node(s) splenic',
    'Lymph node(s) subclavicular',
    'Lymph node(s) submandibular',
    'Lymph node(s) supraclavicular',
    'Lymph nodes(s) mediastinal',
    'Mandible',
    'Maxilla',
    'Mediastinal soft tissue',
    'Mediastinum',
    'Mesentery',
    'Mesothelium',
    'Middle finger',
    'Mitochondria',
    'Muscle',
    'Nails',
    'Nasal cavity',
    'Nasal soft tissue',
    'Nasopharynx',
    'Neck',
    'Nerve',
    'Nerve(s) cranial',
    'Occipital cortex',
    'Ocular orbits',
    'Omentum',
    'Oral cavity',
    'Oral cavity - mucosa only',
    'Oropharynx',
    'Other',
    'Ovary',
    'Palate',
    'Pancreas',
    'Paraspinal ganglion',
    'Parathyroid',
    'Parotid gland',
    'Patella',
    'Pelvis',
    'Penis',
    'Pericardium',
    'Periorbital soft tissue',
    'Peritoneal cavity',
    'Peritoneum',
    'Pharynx',
    'Pineal',
    'Pineal gland',
    'Pituitary gland',
    'Placenta',
    'Pleura',
    'Pleural effusion',
    'Popliteal fossa',
    'Prostate',
    'Pylorus',
    'Rectosigmoid junction',
    'Rectum',
    'Retina',
    'Retro-orbital region',
    'Retroperitoneum',
    'Rib',
    'Ring finger',
    'Round ligament',
    'Sacrum',
    'Salivary gland',
    'Scalp',
    'Scapula',
    'Sciatic nerve',
    'Scrotum',
    'Seminal vesicle',
    'Shoulder',
    'Sigmoid colon',
    'Sinus',
    'Sinus(es), maxillary',
    'Skeletal muscle',
    'Skin',
    'Skull',
    'Small bowel',
    'Small bowel - mucosa only',
    'Small finger',
    'Soft tissue',
    'Spinal column',
    'Spinal cord',
    'Spleen',
    'Splenic flexure',
    'Sternum',
    'Stomach',
    'Stomach - mucosa only',
    'Subcutaneous tissue',
    'Synovium',
    'Temporal cortex',
    'Tendon',
    'Testis',
    'Thigh',
    'Thoracic spine',
    'Thorax',
    'Throat',
    'Thumb',
    'Thymus',
    'Thyroid',
    'Tibia',
    'Tongue',
    'Tonsil',
    'Tonsil (pharyngeal)',
    'Trachea / major bronchi',
    'Transverse colon',
    'Trunk',
    'Umbilical cord',
    'Ureter',
    'Urethra',
    'Urinary tract',
    'Uterus',
    'Uvula',
    'Vagina',
    'Vas deferens',
    'Vein',
    'Venous',
    'Vertebra',
    'Vulva',
    'White blood cells',
    'Wrist',
  ]);
  const confirmed = chooseOne(['Yes', 'No', 'Unknown', 'Not reported']);
  const type = `M-${Math.floor(Math.random() * 9000 + 1000)}/${Math.floor(
    Math.random() * 90 + 10,
  )}`;
  const gradingSystem = chooseOne([
    'Default',
    'Gleason',
    'Nottingham',
    'Brain cancer',
    'ISUP',
    'Lymphoid neoplasms',
  ]);
  const grade = 'A1'; // dont have a sample value for this arbitrary string
  const stagingSystem = chooseOne([
    'Binet',
    'Rai',
    'FIGO',
    'Ann Arbor',
    'Murphy',
    'Lugano',
    'AJCC 8th Edition',
    'AJCC 7th Edition',
    'AJCC 6th Edition',
    'AJCC 5th Edition',
    'AJCC 4th Edition',
    'AJCC 3rd Edition',
    'AJCC 2nd Edition',
    'AJCC 1st Edition',
  ]);
  const stageGroup = 'StageGroup';
  const pathoT = '';
  const pathoN = '';
  const pathoM = '';
  const percentTumor = Math.floor(Math.random() * 100);
  const percentProliferating = Math.floor(Math.random() * 100);
  const percentInflam = Math.floor(Math.random() * 100);
  const percentStromal = Math.floor(Math.random() * 100);
  const percentNecrosis = Math.floor(Math.random() * 100);
  return [
    donorId,
    specimenId,
    acquisitionInterval,
    location,
    confirmed,
    type,
    gradingSystem,
    grade,
    stagingSystem,
    stageGroup,
    pathoT,
    pathoN,
    pathoM,
    percentTumor,
    percentProliferating,
    percentInflam,
    percentStromal,
    percentNecrosis,
  ].join('\t');
};

const generateSpecimenFile = ({ shortName, count, submitterIdStart = 0 }) => {
  const headers = `submitter_donor_id\tsubmitter_specimen_id\tacquisition_interval\tanatomic_location_of_specimen_collection\tcentral_pathology_confirmed\ttumour_histological_type\ttumour_grading_system\ttumour_grading_system\ttumour_grade\ttumour_staging_system\tpathological_stage_group\tpercent_tumour_cells\tpercent_proliferating_cells\tpercent_inflammatory_tissue\tpercent_stromal_cells\tpercent_necrosis\n`;
  const records = [];
  for (let i = 0; i < count; i++) {
    const donorId = `do-${shortName}-${i + submitterIdStart}`;
    records.push(specimenRecord(shortName, i + submitterIdStart, donorId));
  }
  const data = headers.concat(records.join('\n'));

  return data;
};

module.exports = {
  generateRegistrationFile,
  generateDonorFile,
  generateSpecimenFile,
};
