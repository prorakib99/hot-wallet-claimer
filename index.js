import { chromium, devices } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Fix for __dirname in ESM

// Set the token in chrome.storage.local for the extension
// const token =
//     '58431c9874feb7e14bf7cd66ecfa97ed:c789b2a385e55da26bc2ad20c8a302d8439c11882187b9feb969df75cd4f45e051e3bbc4f7d5f5a4ffdc36a386ebd6cc5b89e38f2844daebba35e9056146591789b5f30ec177b922185e7916e6ed9635c21d5a8fa51074914950803195c5b79a30299583e15f0e16062f8ebfbef770ce1c84a24e889886b4d4db3b583e9b5a952b5d4a925dafd95d5517e5bf49f7d489dc8b8e429002ce3a859e39f86aac37e9d91b93a6405fa8415ec0c2977f71f0a4c50ff0a7d7c0dc100b66c7008e7b40c4c5feeec2849dacc0403ca2c86ff159aed557fb5b28705f4a0462e1330559b664d817e1891773e89965bb8b5e809f8b83f8608e96563a1a6081ccadd72c5f20ca7165aa3fc1e87661ef7dcbcd3491d5c616ebbd324e86e541cde025af0c3948b44a4e97d5a6fbf1e6b473fc1893c9385ab4ddec72db6404687223e2ce5e57a460ebf60f6693625883639a75aa7701913b0447fe8e68ce4cd542a4dd4077dd0323937cbbe25c4d553f5e50a90f8c3f626970490eb2701919b92a113463032c456396b0588a0a111ee1ef02492a07c5b1b883c620117aa118efca27ef7bc7adb715a522bc3304da2f7413b4eedfe606413a1354870c0f2830e247365dc9e2fe8e2e08589db3517d17ff100c1390427f184a2cd00961b61081dddbbfed3b4c92007a6fb71ba17cf1c94809194b458765391a7ba284c2cdc6cc5f28bf2b2ff2b0347b62c36e257734a7e55449041c6e6c07c76eedb7e8810d2fa2697284033466fe1bb94be15bd4ca1f27b85ba1df39f190eed8e24fe1d32ef0fc2bf97591de232446a091b81ed3f7243a75ff75f4eec1f6400351e27bf9ac522ed8671d0b06f35c111d09100c22384fd70b76e7914e4002be8a6ff2074998b27f70ab80672701bff5583a48cd1b643691495c7146e47640b804a7f83aa0e47d5e1457fc76dee02a3f6c3b2a00afc38fadf72ff4159f8e7ee5bf2f8b15dfbb7347d55f8417a5b6b08f856066eac302acc27a2545f073d2d05f9e557a166b82b1498c3d0df850eac170fe563552cdd26bd24d90b11a4dcc568bb29be342a4ca06d1bbaa577e5b27969dda3665cbb4868954ffff7cc1cfbebcb04c9b315b8949be2ede478ee9dc779db87c0fde544513f26775731dc6280c702d0e0c8792b1194e1e6d9bdb6603076818e9884826a41ac994035737b1bf645d6c0bcc604b213ddf88ad6c2b64a721b39615afd0ab37f2684c2e98c722a36494d01e8d7290630a6269e4c6c43789820d87a53fa12501be007dd98c1aea477755fa9f06337ab8f0ad1b1decc290ab78124ce4147420cc6af9d2f6d7102415f52a5247dd20627df53fbe38a35e517dafcda0074f09f4e320eca5d9f316bb21a5871471e2faecd8cdd88922790ca507fd08f541c056411b371129dc5a417a3f643acaed3251e24f67769f592fba233925a3a53ac8e3f13eeb7fe285758cec3117668554759fe7892356d2324044d7847420ba';

// const token =
//     'e283daa0ee25e756ead9d02dad9d0458:0d41922e5c8e48cadc93e3d98cd70a4f9d46c277b1fd05581fb50f4b4d7db0c0f9b37221486ed1d10e5c6022b2092f5035c1080580eef6c620af65dcbc9a73be7509e7fafc8c3ee1c287e3b41e16321e9e04ca816bfed01a21668aa5754a2c25b382a2cc4d1abfbb4addf5674d9c342673496ab653c2a734c25973a74c01b41f1106747aa0e2d372529f33b4018ae7fe698b19907be62aa34fd3e36b0a14d55cbedc0c44f24a5cae3269d11a4f697498bd1a8e4d6e33b9656caf77be9f41bfdfd501d965d2df9bc1f51b2b269acbf11835547ec6aee64e6f5e318c5ca9b18f165b8c576cc52ac7710d6833b94b826345bf12d6ba097e9d69282c90c237007425c6ca543a170215767070c5910f7499864b741d3c4eafcec737424b457b9cbfddd33af141ef2eceb89407a535d39b2b87114b8cca5f78ce6ee52f5f48602c37d595ba421fe60c35162dd45c966ce3f2681c73578b402b59eea0830031b874600a4923aad99323a78e2518370e98569f1e4927a73cf577e26b0ee5c0a9e680cb0b8082a8d61aaaa65f9fa25d854d952f764a39cddb7e89365f8458ed0eeb4338fe61ec0f6d7e0ff61954cf34ccd1cabe50569ccfa091de4fe77e3555c920cff907ab7072db3a2fc336e941f912786ae26b9e216a3a6a85793079d89d49856586c4ff0ce823a410634301f9579a1c202c4b1a5a673aef4ffc91c98f34ce70fab027aa4f29067e87e6bfc106e2307ccd2f679e29276227b9d6e5891cd4e6b50c1c7b92ef2087d3e28d987f764a071c152d4218fcddeb0778f0e7f6852d86b1b5da2e79c5dc5bb7806481dfe558c869165f2f0c189bdae6c00925ac49aa77e3407312';

const token =
    '170afd028cc9cb8c12d3abb73fead4ba:3c9535094656a140b62ccabe225ad9fd4b0e8121f9901caffb28e25b4aa62816390505cf71cee328363e77966aade66134e3071f18ecc2beb0d7ad47bb19dce77d164da755b9498c11071ebad620fa9f6e543acd72b0c768fc24d3a94f16e8f3e06879e39ee2cee675cd4870d926abd0f25c3d6db1fd1f36d10520695ea4b8bf097c54fcf9449ea8cdbdf3391076c7f9c437a5d0ff702fdf60c95516071481034ff0521659ffd748395587e3cbba9f111ffb7d9472065023b64fb9898ceccdecd601cb1ea7fb4bee6c91e58bb35f88ac60a67fb524f7a08dde78dc8dd6f5f4fd6cb3dfda122b6199f3dfa58c230debce0e0d2a7b49047b68f3d14cd42af79f962f568e937e84b0e97323e0500953f08ff08c30b21653ec2267208015ac76ccbbfca56ebc87839452eb746efbc9a9d1c991d3c48814506f27e5e7ded6973a6c564c258f35ee3defa1ea1223a556dfa5e2b41e5a2172da2566acf3597b9a55d90a83ebec0dacc986509bcc617cdcc6de067691d2a3bfda54eafc6f0176c60573224e054c352559b1a5c6b19f824b8257997a4e0e524c171ed4380ec62ff9bb838e757c55f6206ccdf03ac5b94b96007f1f6928f88cbc39bdefff3b74d11ca24286de0e869056603184a9e94a78c14994e3d98df9e620c59ea3fc84ef3b7a5e877d350394af37cb20bfb58738541a8c795c1cf39d28b3c3c2fcfdb1cd552456787e43c14c0e016972632a892a8f4c2747eed6154d9cf9c85625d1dc639a6ababff8a15e85ce860330ccc15ef4308ade6f350a004c7aedc45250c9bec8a23846bb4317668da7a67dbb2ecbcbdf446a666a3027af624cee845f49a0170866efafff4d9c8584783a2b287e81046ab94cf5b56049a6659d0c481283bd1e4e8f96223646b01fe531941c6da877a03e18f94f58663b15a13d0c617b6960b2a5b9640997ebb357a3a84c510d87375aa447094dbcdebce5ba091bf68b1e3cdd050be2463c11079df67778e1dde6b2dcf86f7a5cc1e1fc9bbe8172f3ef1208232c91a5e2c892baddcc39d478d128fb9e4318e374b73ae51efcdaf5c0385146d95f805f1ea9060c29ac539a7aa2c32f8f5846ef034748712da17c3c01b9632355c1cb6a50b3239ddfad98f8a985b1ce0b693295daec92624b5d3893db27fb4c22198d8915120362a5ea791b4d9c3c8a42cb2d81f91c5d433b107acac1cbbd340c32f34289ba7f108807f5add105782ba26badcb16881d324fd59a82797f76c316b900fed18a9ac7670e0b924dccfa539ab32948c9c2ae2f54d5ae4d7fb7ec3ac01f1b8e0edc9e507028e609082075bc204a313ffd0347054173618f90655a2651c1377275ff66a2b7fc88f8e31252cc29383b8935abbb025379f51431d34f39a8be7d5aba32368ac2594b86fa382029afee0423b271135fd09a6cc99a2b227349c05f83ce2c6840145dfd8af5813074b4d8d16eb3d8fbf59db63b3abdac1e21c96b0176e4cf27394883ac1ea365b9ddbed6e0c6758b9f26eb05ea699b014b830465c17d703197';

(async () => {
    const pathToExtension = path.join(__dirname, 'hot-wallet-extension');

    const context = await chromium.launchPersistentContext('', {
        headless: false, // Extensions require headless mode to be false
        args: [
            `--disable-extensions-except=${pathToExtension}`,
            `--load-extension=${pathToExtension}`,
            '--disable-gpu', // Disable GPU to make headless mode more stable
            '--no-sandbox' // Avoid sandboxing issues in headless mode
        ],
        slowMo: 3000
    });

    // Open the extension page
    const extensionUrl = 'chrome-extension://mpeengabcnhhjjgleiodimegnkpcenbk/index.html';
    const page = await context.newPage();

    // Simulate an iPhone 6/7/8
    const iPhone = devices['iPhone 15'];
    await page.setViewportSize({ width: iPhone.viewport.width, height: iPhone.viewport.height });

    await page.goto(extensionUrl, { waitUntil: 'load' });

    // Close all pages that are NOT the extension URL
    for (const p of context.pages()) {
        if (p.url() !== extensionUrl) {
            await p.close();
        }
    }

    await page.locator('video').evaluate((video) => {
        video.style.zIndex = '-9999'; // Set z-index using inline CSS
    });

    await page.evaluate((token) => {
        // Setting token in chrome.storage.local
        chrome.storage.local.set({ encrypted: token });
    }, token);

    await page.reload();

    await page.locator('h4:has-text("Storage")').click();

    const checkNewsButton = await page.locator('button:has-text("Check NEWS")');
    const isCheckNewsButton = await checkNewsButton.isVisible();

    if (isCheckNewsButton) {
        await checkNewsButton.click();
        console.log('Clicked: Check NEWS');
        const extensionUrl = 'chrome-extension://mpeengabcnhhjjgleiodimegnkpcenbk/hot';
        for (const p of context.pages()) {
            if (p.url() !== extensionUrl) {
                await p.close();
            }
        }
    }

    const claimHotButton = await page.locator('button:has-text("Claim HOT")');
    const isClaimHotButton = await claimHotButton.isVisible();

    if (isClaimHotButton) {
        await claimHotButton.click();
        console.log('Clicked: Claim HOT');
    }

    await page.waitForTimeout(60000);

    await context.close();
})();
