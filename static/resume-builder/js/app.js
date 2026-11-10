// regex for validation
const strRegex =  /^[a-zA-Z\s]*$/; // containing only letters
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
/* supports following number formats - (123) 456-7890, (123)456-7890, 123-456-7890, 123.456.7890, 1234567890, +31636363634, 075-63546725 */
const digitRegex = /^\d+$/;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const mainForm = document.getElementById('cv-form');
    if (!mainForm) return;

    // user inputs elements
    let firstnameElem = mainForm.firstname,
        middlenameElem = mainForm.middlename,
        lastnameElem = mainForm.lastname,
        imageElem = mainForm.image,
        designationElem = mainForm.designation,
        addressElem = mainForm.address,
        emailElem = mainForm.email,
        phonenoElem = mainForm.phoneno,
        summaryElem = mainForm.summary;

    // display elements
    let nameDsp = document.getElementById('fullname_dsp'),
        imageDsp = document.getElementById('image_dsp'),
        phonenoDsp = document.getElementById('phoneno_dsp'),
        emailDsp = document.getElementById('email_dsp'),
        addressDsp = document.getElementById('address_dsp'),
        designationDsp = document.getElementById('designation_dsp'),
        summaryDsp = document.getElementById('summary_dsp'),
        projectsDsp = document.getElementById('projects_dsp'),
        achievementsDsp = document.getElementById('achievements_dsp'),
        skillsDsp = document.getElementById('skills_dsp'),
        educationsDsp = document.getElementById('educations_dsp'),
        experiencesDsp = document.getElementById('experiences_dsp');

    // Add event listener for image change
    if (imageElem) {
        imageElem.addEventListener('change', previewImage);
    }

    // Generate CV on page load
    generateCV();
});

// first value is for the attributes and second one passes the nodelists
const fetchValues = (attrs, ...nodeLists) => {
    let elemsAttrsCount = nodeLists.length;
    let elemsDataCount = nodeLists[0].length;
    let tempDataArr = [];

    // first loop deals with the no of repeaters value
    for(let i = 0; i < elemsDataCount; i++){
        let tempObj = {};
        // second loop fetches the attributes value
        for(let j = 0; j < elemsAttrsCount; j++){
            tempObj[`${attrs[j]}`] = nodeLists[j][i].value;
        }
        tempDataArr.push(tempObj);
    }
    return tempDataArr;
}

const getUserInputs = () => {
    const mainForm = document.getElementById('cv-form');
    if (!mainForm) return {};

    // achievements
    let achievementsTitleElem = document.querySelectorAll('.achieve_title'),
        achievementsDescriptionElem = document.querySelectorAll('.achieve_description');
    
    // experiences
    let expTitleElem = document.querySelectorAll('.exp_title'),
        expOrganizationElem = document.querySelectorAll('.exp_organization'),
        expLocationElem = document.querySelectorAll('.exp_location'),
        expStartMonthElem = document.querySelectorAll('.exp_start_month'),
        expStartYearElem = document.querySelectorAll('.exp_start_year'),
        expEndMonthElem = document.querySelectorAll('.exp_end_month'),
        expEndYearElem = document.querySelectorAll('.exp_end_year'),
        expDescriptionElem = document.querySelectorAll('.exp_description');

    // education
    let eduSchoolElem = document.querySelectorAll('.edu_school'),
        eduDegreeElem = document.querySelectorAll('.edu_degree'),
        eduCityElem = document.querySelectorAll('.edu_city'),
        eduStartMonthElem = document.querySelectorAll('.edu_start_month'),
        eduStartYearElem = document.querySelectorAll('.edu_start_year'),
        eduEndMonthElem = document.querySelectorAll('.edu_end_month'),
        eduEndYearElem = document.querySelectorAll('.edu_end_year'),
        eduDescriptionElem = document.querySelectorAll('.edu_description');

    // projects
    let projTitleElem = document.querySelectorAll('.proj_title'),
        projLinkElem = document.querySelectorAll('.proj_link'),
        projDescriptionElem = document.querySelectorAll('.proj_description');

    // skills
    let skillElem = document.querySelectorAll('.skill');

    return {
        firstname: mainForm.firstname ? mainForm.firstname.value : '',
        middlename: mainForm.middlename ? mainForm.middlename.value : '',
        lastname: mainForm.lastname ? mainForm.lastname.value : '',
        designation: mainForm.designation ? mainForm.designation.value : '',
        address: mainForm.address ? mainForm.address.value : '',
        email: mainForm.email ? mainForm.email.value : '',
        phoneno: mainForm.phoneno ? mainForm.phoneno.value : '',
        summary: mainForm.summary ? mainForm.summary.value : '',
        achievements: fetchValues(['title', 'description'], achievementsTitleElem, achievementsDescriptionElem),
        experiences: fetchValues(['title', 'organization', 'location', 'start_month', 'start_year', 'end_month', 'end_year', 'description'], expTitleElem, expOrganizationElem, expLocationElem, expStartMonthElem, expStartYearElem, expEndMonthElem, expEndYearElem, expDescriptionElem),
        educations: fetchValues(['school', 'degree', 'city', 'start_month', 'start_year', 'end_month', 'end_year', 'description'], eduSchoolElem, eduDegreeElem, eduCityElem, eduStartMonthElem, eduStartYearElem, eduEndMonthElem, eduEndYearElem, eduDescriptionElem),
        projects: fetchValues(['title', 'link', 'description'], projTitleElem, projLinkElem, projDescriptionElem),
        skills: (() => {
            let tempArr = [];
            for(let i = 0; i < skillElem.length; i++){
                tempArr.push(skillElem[i].value);
            }
            return tempArr;
        })()
    }
};

function previewImage(){
    const mainForm = document.getElementById('cv-form');
    if (!mainForm || !mainForm.image) return;
    
    const imageElem = mainForm.image;
    const imageDsp = document.getElementById('image_dsp');
    
    if (imageElem.files.length > 0 && imageDsp) {
        let oFReader = new FileReader();
        oFReader.readAsDataURL(imageElem.files[0]);
        oFReader.onload = function(ofEvent){
            imageDsp.src = ofEvent.target.result;
        }
    }
}

function generateCV(){
    let userInputs = getUserInputs();
    
    // display the image
    previewImage();

    // Get display elements
    let nameDsp = document.getElementById('fullname_dsp'),
        phonenoDsp = document.getElementById('phoneno_dsp'),
        emailDsp = document.getElementById('email_dsp'),
        addressDsp = document.getElementById('address_dsp'),
        designationDsp = document.getElementById('designation_dsp'),
        summaryDsp = document.getElementById('summary_dsp'),
        projectsDsp = document.getElementById('projects_dsp'),
        achievementsDsp = document.getElementById('achievements_dsp'),
        skillsDsp = document.getElementById('skills_dsp'),
        educationsDsp = document.getElementById('educations_dsp'),
        experiencesDsp = document.getElementById('experiences_dsp');
    
    // display basic info
    if (nameDsp) nameDsp.innerHTML = `${userInputs.firstname} ${userInputs.middlename} ${userInputs.lastname}`;
    if (phonenoDsp) phonenoDsp.innerHTML = `<i class="fas fa-phone"></i> ${userInputs.phoneno}`;
    if (emailDsp) emailDsp.innerHTML = `<i class="fas fa-envelope"></i> ${userInputs.email}`;
    if (addressDsp) addressDsp.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${userInputs.address}`;
    if (designationDsp) designationDsp.innerHTML = userInputs.designation;
    if (summaryDsp) summaryDsp.innerHTML = userInputs.summary;

    // display achievements
    if (achievementsDsp) {
        achievementsDsp.innerHTML = '';
        for(let i = 0; i < userInputs.achievements.length; i++){
            if(userInputs.achievements[i].title.trim() !== '' && userInputs.achievements[i].description.trim() !== ''){
                achievementsDsp.innerHTML += `
                    <div class="preview-item">
                        <span class="preview-item-val fw-6">${userInputs.achievements[i].title}</span>
                        <span class="preview-item-val">${userInputs.achievements[i].description}</span>
                    </div>
                `;
            }
        }
    }

    // display experiences
    if (experiencesDsp) {
        experiencesDsp.innerHTML = '';
        for(let i = 0; i < userInputs.experiences.length; i++){
            if(userInputs.experiences[i].title.trim() !== '' && userInputs.experiences[i].organization.trim() !== ''){
                experiencesDsp.innerHTML += `
                    <div class="preview-item">
                        <span class="preview-item-val fw-6">${userInputs.experiences[i].title}</span>
                        <span class="preview-item-val">${userInputs.experiences[i].organization}, ${userInputs.experiences[i].location}</span>
                        <span class="preview-item-val">${userInputs.experiences[i].start_month} ${userInputs.experiences[i].start_year} - ${userInputs.experiences[i].end_month} ${userInputs.experiences[i].end_year}</span>
                        <span class="preview-item-val">${userInputs.experiences[i].description}</span>
                    </div>
                `;
            }
        }
    }

    // display education
    if (educationsDsp) {
        educationsDsp.innerHTML = '';
        for(let i = 0; i < userInputs.educations.length; i++){
            if(userInputs.educations[i].school.trim() !== '' && userInputs.educations[i].degree.trim() !== ''){
                educationsDsp.innerHTML += `
                    <div class="preview-item">
                        <span class="preview-item-val fw-6">${userInputs.educations[i].school}</span>
                        <span class="preview-item-val">${userInputs.educations[i].degree}</span>
                        <span class="preview-item-val">${userInputs.educations[i].city}</span>
                        <span class="preview-item-val">${userInputs.educations[i].start_month} ${userInputs.educations[i].start_year} - ${userInputs.educations[i].end_month} ${userInputs.educations[i].end_year}</span>
                        <span class="preview-item-val">${userInputs.educations[i].description}</span>
                    </div>
                `;
            }
        }
    }

    // display projects
    if (projectsDsp) {
        projectsDsp.innerHTML = '';
        for(let i = 0; i < userInputs.projects.length; i++){
            if(userInputs.projects[i].title.trim() !== ''){
                projectsDsp.innerHTML += `
                    <div class="preview-item">
                        <span class="preview-item-val fw-6">${userInputs.projects[i].title}</span>
                        <span class="preview-item-val">${userInputs.projects[i].link}</span>
                        <span class="preview-item-val">${userInputs.projects[i].description}</span>
                    </div>
                `;
            }
        }
    }

    // display skills
    if (skillsDsp) {
        skillsDsp.innerHTML = '';
        for(let i = 0; i < userInputs.skills.length; i++){
            if(userInputs.skills[i].trim() !== ''){
                skillsDsp.innerHTML += `
                    <div class="preview-item">
                        <span class="preview-item-val">${userInputs.skills[i]}</span>
                    </div>
                `;
            }
        }
    }
}

// print CV
function printCV(){
    window.print();
}