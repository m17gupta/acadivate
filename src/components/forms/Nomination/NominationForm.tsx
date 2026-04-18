
"use client";
import React, { useState, useEffect } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import styles from './NominationForm.module.css';
import { AppDispatch } from '@/src/hook/store';
import { useDispatch } from 'react-redux';
import { createNominationThunk } from '@/src/hook/nominations/nominationThunk';
import { NominationFormType } from '@/src/hook/nominations/nominationType';

const academicAwards = [
  "Life Time Achievement Award (above 55 Years of Age)", "Hon. Fellowship (FAFSRI) (Below 40 Years of Age)", "Eminent Scientist award",
  "Senior Scientist Award (Above 45 years of age)", "Scientist Associate Award Research", "Young Scientist Award in Agriculture Science",
  "Young Scientist Award in Chemical Science", "Young Scientist Award in Animal Husbandry", "Young Scientist Award in Animal Science",
  "Young Scientist Award in Fisheries Sciences", "Young Scientist Award in Plant Science", "Young Scientist Award in Agriculture Outstanding Achievement Award",
  "Young Scientist Award in Social Sciences", "Innovative Biologist Award for Wild Life/ Biodiversity Conservation", "Young Scientist Award for Humanistic Studies",
  "Best Academician Award (Humanities/ Commerce and Managements/ Interdisciplinary Studies)", "Excellence in Extension Scientist Award",
  "Outstanding Extension Professional/Agriculture Scientist/ Social Services Award", "Excellence in Teaching Award (Humanities/ Commerce and Managements/ Interdisciplinary Studies.)",
  "Excellence in Research Award (Humanities/ Commerce and Managements/ Interdisciplinary Studies.)",
  "Distinguished Scientist Award/Distinguished Service Award / Distinguished Teacher Award (Crop, Plant Protection, Horticulture, Fisheries, Home Science, Social Science, Animal Science, Life Science etc.)",
  "Technological Innovations Award", "Young Woman Scientist Award", "Young Botanist/Zoologist/Scientist Award (below 30 years of age; mainly for research scholar)",
  "Excellence in Research Award for Humanistic Studies", "Young Professional Award (Humanities/ Commerce and Managements/ Interdisciplinary Studies)",
  "Young Environmentalist Award", "Best Research Scholar Award"
];

const startupAwards = [
  "Digital / Online Start-up", "eRetail Start up of the Year", "Best HR Tech Start up of the Year", "B2B Start up of the Year",
  "Tech Startup of the Year", "On-Demand Delivery Startup of the year", "Fashion Startup of the year", "Social Commerce Startup of the Year",
  "Agritech Startup of the Year", "Fintech Startup of the Year", "Health Tech Startup of the Year", "Best Drone Tech Start Up of the Year",
  "Cloud Startup of the Year", "Networking Startup of the Year", "InsureTech Startup of the Year", "Proptech Startup of the Year",
  "Media/Entertainment Startup of the Year", "SpaceTech Startup of the Year", "Edtech Startup of the Year", "Accelerator of the Year",
  "Innovative Start-up of the Year", "Home or Craft-based Startup", "Gaming app of the year", "Emerging Start-up",
  "Mobility Start-up of the year", "Energy Start-up of the Year", "Logistics /Fulfilment Start-up of the Year", "Food Startup",
  "Beverage Startup", "Beauty Startup", "Wellness Startup", "Best healthcare startup", "Best Education Startup Of The Year",
  "Blockchain Innovator of the year", "Best NFT Platform of the Year", "Metaverse Startup of the Year", "CEO of the Year (Large Business)",
  "Bootstrapped Business Of The Year", "Retail Startup Of The Year", "Travel Startup of the year", "Real Estate Startup Of The Year",
  "Startup Leader Of The Year", "Founder Of The Year", "Creative Entrepreneur Of The Year - Start-up", "Best Social Impact Startup",
  "Gifting startup of the year", "Clean Tech / Green Startup of the Year"
];

const riseAwards = [
  "Most Enterprising Business", "Best Customer Service", "Business Innovation", "Best Financial Performance", "Best Use of Technology",
  "Business Transformation", "Cross Border Business Growth", "National Quality Award", "Best Workplace of the Year",
  "Most Socially Responsible Company of the Year", "Best Digital Transformation Award", "Best CSR Initiative"
];

const entrepreneurAwards = [
  "Celebrity Entrepreneur of the Year", "Entrepreneur of the Year (Consumer Business)", "Acharya of the Year / Business Mentor of the Year",
  "Entrepreneur of the Year (Innovation in Financial Services)", "Dynamic Entrepreneur of the Year (Business Transformation)",
  "Entrepreneur of the Year (Innovation in Technology)", "Professional Entrepreneur of the Year", "Family Entrepreneur of the Year",
  "Entrepreneur of the Year ( Media & Entertainment )", "Social Entrepreneur of the Year", "Creative Entrepreneur of the Year",
  "Young Entrepreneur of the Year", "Restoration Entrepreneur of the Year", "Serial Entrepreneur of the Year", "Student Entrepreneur of the Year",
  "Intrapreneur of the Year", "Micro /Small online business Entrepreneur of the year", "Green Entrepreneur of the Year", "Entrepreneur of the Year",
  "Woman Entrepreneur of the Year", "Lifetime Achievement", "Entrepreneur of the Year - Real Estate", "Venture Capitalist of the Year",
  "Angel Investor of the Year", "Entrepreneur of the Year in Trading Business", "Entrepreneur of the Year in Service Business",
  "Entrepreneur of the Year in Product or Manufacturing Business"
];

const BASE_FEE = 5500;
const GST_RATE = 0.18;
const HANDLING_PER_CAT = 500;
 console.log("academicAwards",academicAwards)

const NominationForm: React.FC = () => {


  const [formData, setFormData] = useState({
    orgName: '',
    promoter: '',
    ownership: '',
    address: '',
    mobile: '',
    state: '',
    city: '',
    email: '',
    website: '',
    gstin: '',
    selectedAwards:[],
    paymentMode: 'Online Banking',
    agreeTerms: false,
    researchPublication: [] as File[],
    bookPublication: [] as File[],
    researchProject: [] as File[],
    patentPolicyDocument: [] as File[],
    status:"pending"
  });
  const [selectedAwards, setSelectedAwards] = useState({
    academic: [] as string[],
    startup: [] as string[],
    rise: [] as string[],
    entrepreneur: [] as string[]
  });
  const [payableAmount, setPayableAmount] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', isError: false });
 const dispatch= useDispatch<AppDispatch>()
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if (type === 'file') {
      const files = (e.target as HTMLInputElement).files;
      setFormData(prev => ({
        ...prev,
        [name]: files ? Array.from(files) : [],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };


  console.log("formData---",formData)
  // Delete a file from a specific field
  const handleDeleteFile = (field: keyof typeof formData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as File[]).filter((_, i) => i !== index),
    }));
  };

  const handleAwardChange = (category: keyof typeof selectedAwards, award: string, checked: boolean) => {
    setSelectedAwards(prev => ({
      ...prev,
      [category]: checked 
        ? [...prev[category], award] 
        : prev[category].filter(a => a !== award)
    }));
  };

  useEffect(() => {
    const selectedCount = Object.values(selectedAwards).flat().length;
    if (selectedCount === 0) {
      setPayableAmount(0);
    } else {
      const subtotal = selectedCount * BASE_FEE;
      const gst = subtotal * GST_RATE;
      const handling = selectedCount * HANDLING_PER_CAT;
      const total = subtotal + gst + handling;
      setPayableAmount(total);
    }
  }, [selectedAwards]);

  const showToast = (message: string, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast({ show: false, message: '', isError: false }), 3500);
  };

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    debugger
   console.log("submiutetdgdvd")
   debugger
    // const { orgName, promoter, ownership, address, mobile, state, city, email, agreeTerms } = formData;

    // if (!orgName.trim()) { showToast('Organization name required', true); return; }
    // if (!promoter.trim()) { showToast('Promoter name required', true); return; }
    // if (!ownership) { showToast('Please select ownership pattern', true); return; }
    // if (!address.trim()) { showToast('Address required', true); return; }
    // if (!mobile.trim()) { showToast('Mobile number required', true); return; }
    // if (mobile.length < 8) { showToast('Enter valid mobile number', true); return; }
    // if (!state || state === 'Select State') { showToast('Select state', true); return; }
    // if (!city || city === 'Select City') { showToast('Select city', true); return; }
    // if (!email.trim() || !email.includes('@')) { showToast('Valid email required', true); return; }
    // if (!agreeTerms) { showToast('You must agree to Terms & Conditions', true); return; }

    // if (selectedAwards.length === 0) {
    //   showToast('Please select at least one award category', true);
    //   return;
    // }

    if (payableAmount === 0) {
      showToast('Cannot proceed with zero fee (select categories)', true);
      return;
    }

    const formDataObj: NominationFormType = {
      orgName: formData.orgName,
      promoter: formData.promoter,
      ownership: formData.ownership,
      address: formData.address,
      mobile: formData.mobile,
      state: formData.state,
      city: formData.city,
      email: formData.email,
      website: formData.website,
      gstin: formData.gstin,
      // selectedAwards: Object.values(selectedAwards).flat(),
      academicAwards: selectedAwards.academic,
      startupAwards: selectedAwards.startup,
      riseAwards: selectedAwards.rise,
      entrepreneurAwards: selectedAwards.entrepreneur,
      paymentMode: formData.paymentMode,
      agreeTerms: formData.agreeTerms,
      researchPublication: [],
      bookPublication: [],
      researchProject: [],
      patentPolicyDocument: [],
      status: "pending",
    };
    console.log('Nomination Submitted:', formDataObj);

    const responce= await dispatch(createNominationThunk(formDataObj)).unwrap()
    console.log("respeoinse forem national", responce)
    if(responce.status){
      const totalCount = Object.values(selectedAwards).flat().length;
      showToast(`✓ Nomination submitted! Selected ${totalCount} categories. Total: ₹${payableAmount.toLocaleString('en-IN')}`, false);
    }else{
      showToast(`✗ Nomination submission failed!`, true);
    }
  };

  const renderAwardSection = (title: string, icon: string, awards: string[], category: keyof typeof selectedAwards) => (
    <div className={styles['categories-section']}>
      <div className={styles['section-title']}>
        <i className={`fas ${icon}`}></i> {title}
      </div>
      <div className={styles['cat-grid']}>
        {awards.map(award => (
          <div key={award} className={styles['cat-item']}>
            <input
              type="checkbox"
              checked={selectedAwards[category].includes(award)}
              onChange={(e) => handleAwardChange(category, award, e.target.checked)}
            />
            <label>{award}</label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles['hero-badge']}><i className="fas fa-trophy"></i> Nominations Are Now Open</div>
        <h1><i className="fas fa-award"></i> Acadivate Award Registration</h1>
        <div className={styles.subhead}>If you wish to nominate for awards, kindly fill in the form below. Select one or more categories.</div>
      </div>

      <div className={styles['form-card']}>
        <div className={styles['form-header']}>
          <h2><i className="fas fa-pen-alt"></i> Nomination Form</h2>
          <p>Please provide accurate details. Registration fee applies per selected category.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles['form-grid']}>
            <div className={`${styles['input-group']} ${styles['full-width']}`}>
              <label><i className="fas fa-building"></i> Name of the Organizatio</label>
              <input type="text" name="orgName" value={formData.orgName} onChange={handleInputChange} placeholder="Enter Organization" required />
            </div>
            <div className={styles['input-group']}>
              <label><i className="fas fa-user-tie"></i> Name of the promoter</label>
              <input type="text" name="promoter" value={formData.promoter} onChange={handleInputChange} placeholder="Enter Promoter" required />
            </div>
            <div className={styles['input-group']}>
              <label><i className="fas fa-chart-line"></i> Ownership Pattern</label>
              <div className={styles['ownership-group']}>
                {['Academcian', 'Scientist', 'Reseach Scholar', 'Proprietary', 'Partnership', 'Pvt Limited', 'Public Limited', 'NGOs', 'Others'].map(option => (
                  <label key={option}>
                    <input type="radio" name="ownership" value={option} checked={formData.ownership === option} onChange={handleInputChange} /> {option}
                  </label>
                ))}
              </div>
            </div>
            <div className={`${styles['input-group']} ${styles['full-width']}`}>
              <label><i className="fas fa-map-marker-alt"></i> Address of Correspondence</label>
              <textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="Full address" required></textarea>
            </div>
            <div className={styles['input-group']}>
              <label><i className="fas fa-mobile-alt"></i> Mobile Number</label>
              <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="Enter Mobile Number" required />
            </div>
            <div className={styles['input-group']}>
              <label><i className="fas fa-globe"></i> State</label>
              <select name="state" value={formData.state} onChange={handleInputChange} required>
                <option value="" disabled>Select State</option>
                <option>Maharashtra</option><option>Delhi</option><option>Karnataka</option><option>Tamil Nadu</option><option>Gujarat</option><option>West Bengal</option><option>Uttar Pradesh</option><option>Rajasthan</option><option>Others</option>
              </select>
            </div>
            <div className={styles['input-group']}>
              <label><i className="fas fa-city"></i> City</label>
              <select name="city" value={formData.city} onChange={handleInputChange} required>
                <option value="" disabled>Select City</option>
                <option>Mumbai</option><option>Delhi</option><option>Bengaluru</option><option>Chennai</option><option>Kolkata</option><option>Hyderabad</option><option>Pune</option><option>Ahmedabad</option><option>Others</option>
              </select>
            </div>
            <div className={styles['input-group']}>
              <label><i className="fas fa-envelope"></i> Email id</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter Email" required />
            </div>
            <div className={styles['input-group']}>
              <label><i className="fas fa-link"></i> Website URL</label>
              <input type="url" name="website" value={formData.website} onChange={handleInputChange} placeholder="Enter Website URL" />
            </div>
            <div className={styles['input-group']}>
              <label><i className="fas fa-file-invoice"></i> GSTIN</label>
              <input type="text" name="gstin" value={formData.gstin} onChange={handleInputChange} placeholder="Enter GSTIN" />
            </div>
            {/* PDF Attachment Fields */}
            <div className={styles['input-group']} style={{ marginBottom: '1.5rem' }}>
              <label>Research Publication (PDF, multiple allowed)</label>
              <input type="file" name="researchPublication" accept="application/pdf" multiple onChange={handleInputChange} />
              {formData.researchPublication.length > 0 && (
                <ul style={{ margin: '0.5rem 0 0 0', padding: 0, listStyle: 'none' }}>
                  {formData.researchPublication.map((file, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem', border: '1px solid #b3b3ff', borderRadius: '8px', padding: '0.3rem 0.7rem', background: '#f8faff' }}>
                      <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
                     
                        <Eye size={18} color="#222" 
                         onClick={() => window.open(URL.createObjectURL(file), '_blank')}
                        />
                    
                        <Trash2 size={18} color="red"
                           onClick={() => handleDeleteFile('researchPublication', idx)}
                        />
                     
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className={styles['input-group']} style={{ marginBottom: '1.5rem' }}>
              <label>Book Publication (PDF, multiple allowed)</label>
              <input type="file" name="bookPublication" accept="application/pdf" multiple onChange={handleInputChange} />
              {formData.bookPublication.length > 0 && (
                <ul style={{ margin: '0.5rem 0 0 0', padding: 0, listStyle: 'none' }}>
                  {formData.bookPublication.map((file, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem', border: '1px solid #b3b3ff', borderRadius: '8px', padding: '0.3rem 0.7rem', background: '#f8faff' }}>
                      <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
                     
                        <Eye size={18} color="#222" 
                         onClick={() => window.open(URL.createObjectURL(file), '_blank')}/>
                     
                     
                        <Trash2 size={18} color="red" 
                         onClick={() => handleDeleteFile('bookPublication', idx)}
                        />
                    
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className={styles['input-group']} style={{ marginBottom: '1.5rem' }}>
              <label>Research Project (PDF, multiple allowed)</label>
              <input type="file" name="researchProject" accept="application/pdf" multiple onChange={handleInputChange} />
              {formData.researchProject.length > 0 && (
                <ul style={{ margin: '0.5rem 0 0 0', padding: 0, listStyle: 'none' }}>
                  {formData.researchProject.map((file, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem', border: '1px solid #b3b3ff', borderRadius: '8px', padding: '0.3rem 0.7rem', background: '#f8faff' }}>
                      <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
                     
                        <Eye size={18} color="#222"  onClick={() => window.open(URL.createObjectURL(file), '_blank')}/>
                     
                        <Trash2 size={18} color="red"
                         onClick={() => handleDeleteFile('researchProject', idx)}
                        />
                    
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className={styles['input-group']} style={{ marginBottom: '1.5rem' }}>
              <label>Patent and Policy Document Sanction/Complication (PDF, multiple allowed)</label>
              <input type="file" name="patentPolicyDocument" accept="application/pdf" multiple onChange={handleInputChange} />
              {formData.patentPolicyDocument.length > 0 && (
                <ul style={{ margin: '0.5rem 0 0 0', padding: 0, listStyle: 'none' }}>
                  {formData.patentPolicyDocument.map((file, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem', border: '1px solid #b3b3ff', borderRadius: '8px', padding: '0.3rem 0.7rem', background: '#f8faff' }}>
                      <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
                    
                        <Eye size={18} color="#222" 
                         onClick={() => window.open(URL.createObjectURL(file), '_blank')}/>
                     
                        <Trash2 size={18} color="red" 
                         onClick={() => handleDeleteFile('patentPolicyDocument', idx)}
                        />
                     
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>


      

          {renderAwardSection('Academic and Research Awards', 'fa-graduation-cap', academicAwards, 'academic')}
          {renderAwardSection('Start-up Awards', 'fa-rocket', startupAwards, 'startup')}
          {renderAwardSection('Rise Awards', 'fa-chart-line', riseAwards, 'rise')}
          {renderAwardSection('Entrepreneur Awards (Top Honours)', 'fa-crown', entrepreneurAwards, 'entrepreneur')}

          <div className={styles['fee-summary']}>
            <div className={styles['fee-block']}>
              <div className={styles['fee-item']}><strong>Registration Fees:</strong> INR 5500 (Exclusive GST 18% per category + handling charges)</div>
            </div>
            <div className={styles.payable}>Payable Amount: INR {payableAmount.toLocaleString('en-IN')}</div>
          </div>

          <div className={`${styles['input-group']} ${styles['full-width']}`}>
            <label><i className="fas fa-credit-card"></i> Mode of Payment</label>
            <div className={styles['mode-row']}>
              {['Online Banking', 'Credit/Debit Card', 'UPI', 'Bank Transfer'].map(mode => (
                <label key={mode}>
                  <input type="radio" name="paymentMode" value={mode} checked={formData.paymentMode === mode} onChange={handleInputChange} /> {mode}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.terms}>
            <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleInputChange} required />
            <label style={{ textTransform: 'none', fontWeight: 500 }}>I agree to Terms & Conditions.</label>
          </div>

          <button type="submit"><i className="fas fa-paper-plane"></i> Submit Nominationfff</button>

          {/* <button type="submit" onClick={onClose}><i className="fas fa-paper-plane"></i> Close</button> */}
        </form>
      </div>

      {toast.show && (
        <div className={`${styles['success-toast']} ${toast.show ? styles.show : ''}`} style={{ background: toast.isError ? '#c73e2f' : '#2b6e3c' }}>
          <i className="fas fa-check-circle"></i> <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default NominationForm;