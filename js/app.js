const categories = async () => {
    const res = await fetch('https://openapi.programming-hero.com/api/videos/categories')
    const data = await res.json();
    const categories = data.data;
    
    categories.forEach(category => {
        const categoryContainer = document.querySelector('#categoris');

        const categoryItem = document.createElement('button');
        categoryItem.id = `${category.category_id}`;
        categoryItem.classList = `bg-secondary rounded-md py-1 px-3`;
        categoryItem.setAttribute("onclick",`videosShow(${category.category_id})`);
        categoryItem.innerText = `${category.category}`;
        categoryContainer.appendChild(categoryItem);
    });
}

const hourMin = second => {
    const sec = parseInt(second);
    const hours   = Math.floor(sec / 3600)
    const minutes = Math.floor(sec / 60) % 60

    return `${hours} hrs ${minutes} min`;
}

const videosShow = async (categoriesId, sort) => {
    toggolLoadingSpinner(true);

    const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/${categoriesId}`)
    const data = await res.json();
    const allVideos = data.data;

    const sortViewButton = document.querySelector('.sort');
    sortViewButton.id = categoriesId;

    if (sort) {
        allVideos.sort((a, b) => parseInt(b.others.views) - parseInt(a.others.views));
    }

    const videosContainer = document.getElementById('video-container');
    const errorElement = document.getElementById('error');

    if (data.status === true) {
        videosContainer.textContent = '';
        errorElement.textContent = '';

        allVideos.forEach(video => {
            const videItem = document.createElement('div');
            
            videItem.innerHTML = `
            <div class="relative">
                <img class="rounded-lg mx-auto w-full h-[200px]" src="${video.thumbnail}" alt="">  
                ${video.others.posted_date ? `<p class="absolute bg-dark rounded-md text-sm text-white right-2 bottom-2 py-1 px-2"> ${hourMin(video.others?.posted_date)} ago</p>`: ''}
            </div>
            <div class="flex items-start gap-2 my-2">
                <img class="w-10 h-10 rounded-full" src="${video.authors[0].profile_picture}" alt="">
                <div>
                    <h1 class="font-bold">${video.title}</h1>
                    <div class="flex items-center gap-2">
                        <h4 class="text-sm text-dark_2">${video.authors[0].profile_name}</h4>
                        ${video.authors[0].verified === true ? '<img class="w-4 h-4" src="/images/fi_10629607.svg" alt="Verified">': ''}
                    </div>
                    <p class="text-sm text-dark_2">${video.others?.views} views</p>
                </div>
            </div>
            `
            videosContainer.appendChild(videItem);
            toggolLoadingSpinner(false);
        });
    } else {
        videosContainer.textContent = '';
        errorElement.textContent = '';

        const errorDiv = document.createElement('div');
        errorDiv.classList = `flex flex-col justify-center items-center py-10`;
        errorDiv.innerHTML = `
                                <img class="w-20 md:w-28" src="./images/icon.png" alt="">
                                <h3 class="text-dark font-bold text-xl md:text-3xl text-center pt-5">Oops!! Sorry, There is no <br>content here</h3>
                            `
        errorElement.appendChild(errorDiv)
        toggolLoadingSpinner(false);
    }
}

const toggolLoadingSpinner = (isLoading) => {
    const spinner = document.querySelector('#loading-spinner');
    if (isLoading) {
        spinner.classList.remove('hidden');
    } else {
        spinner.classList.add('hidden');
    }
}

const sortVideos = (id) => {
    videosShow(id, true);
}

categories();
videosShow(1000);