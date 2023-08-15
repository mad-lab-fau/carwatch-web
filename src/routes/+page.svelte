<script lang="ts">
	import { browser } from "$app/environment";
	import logo from "$lib/assets/logo.png";
	import data from "$lib/assets/data.png";
	import labels from "$lib/assets/labels.png";
	import setup from "$lib/assets/setup.png";
	import app from "$lib/assets/app.png";
	import { Accordion, AccordionItem } from "@skeletonlabs/skeleton";
	import { base } from "$app/paths";

	function scrollToNextPage(event: any) {
		const el = document.querySelector(event.target.hash);
		if (!el) return;
		el.scrollIntoView({
			behavior: 'smooth'
		});
	}

	function toggleAccordion(event: any){
		let el = document.getElementById("demo-img");
		if(event.detail.open && browser && el instanceof HTMLImageElement){
			switch (event.detail.id) {
				case "accordion-control-setup":
					el.src = setup;
					break;
				case "accordion-control-labels":
					el.src = labels;
					break;
				case "accordion-control-app":
					el.src = app;
					break;
				case "accordion-control-data":
					el.src = data;
					break;
				default:
					break;
			}
		}
	}
</script>

<div class="grid grid-cols-3 gap-4 md:gap-10 items-center justify-items-center h-screen">
	<div class="flex flex-col col-span-2 row-span-3 items-center xl:items-start text-center xl:text-left space-y-4">
		<h1 class="!text-5xl md:!text-6xl max-w-[800px]">Welcome to the <br> CARWatch Project!</h1>
		<p class="!text-xl max-w-[675px]">
			<b>CARWatch is a free open-source framework to support objective and low-cost assessment of biomarker samples in real-world environments.</b>
		</p>
		<p class="!text-xl max-w-[675px]">
			<span class="mr-6">&#9200;</span>Developed for Cortisol Awakening Response (CAR) studies
		</p>
		<p class="!text-xl max-w-[675px]">
			<span class="mr-6">&#129404;</span>Suitable for lab-based biomarker collection studies
		</p>
		<p class="!text-xl max-w-[675px]">
			<span class="mr-6">&#127968;</span>Suitable for biomarker-based studies at home
		</p>
		<p class="!text-xl max-w-[675px]">
			<span class="mr-6">&#9989;</span>Supports study preparation, data collection & postprocessing
		</p>
		<div class="flex gap-8">
			<a href="{base}/preparation" class="btn variant-filled-primary">
				<span class="text-xl">Configure Your Study</span>
				<i class="fa-solid fa-arrow-right-long" />
			</a>
			<a href="{base}/postprocessing" class="btn variant-filled-primary">
				<span class="text-xl">Analyze your Data</span>
				<i class="fa-solid fa-arrow-right-long" />
			</a>
		</div>
	</div>
	<div class="w-full hidden md:inline-block row-span-3 max-w-[250px] mx-auto">
		<img src={logo} alt="CARWatch Logo">
	</div>
	<div class="flex flex-col col-span-3 items-center">
			<span class="material-symbols-outlined text-7xl">
		<a href="#page-2" on:click|preventDefault={scrollToNextPage}>
				keyboard_double_arrow_down
		</a>
			</span>
	</div>
</div>

<div class="grid xl:grid-cols-2 grid-cols-1 gap-4 md:gap-10 items-center justify-items-center h-screen" id="page-2">
	<div class="flex flex-col items-center xl:items-start text-center xl:text-left space-y-4">
		<div class="md:w-[700px] w-full xl:h-[400px] h-1/2 card p-8 variant-glass-primary">
			<Accordion autocollapse>
				<AccordionItem id="setup" open on:toggle={toggleAccordion}>
					<svelte:fragment slot="lead">
						<span class="material-symbols-outlined">
							tune
						</span>
					</svelte:fragment>
					<svelte:fragment slot="summary">
						<h3 class="h3">Straightforward study setup</h3>
					</svelte:fragment>
					<svelte:fragment slot="content">
						<div>
							<ul class="list">
								<li><span>&#8226;</span>
									<span class="flex-auto">Straightforward study setup</span>
								</li>
								<li><span>&#8226;</span>
									<span class="flex-auto">Customize study properties to your needs</span>
								</li>
								<li><span>&#8226;</span>
									<span class="flex-auto">Set up your desired sampling schedule</span>
								</li>
								<li><span>&#8226;</span>
									<span class="flex-auto">Generata a QR-Code for the CARWatch app to automatically set up the study in the app</span>
								</li>
							</ul>
						</div>
					</svelte:fragment>
				</AccordionItem>
				<AccordionItem id="labels" on:toggle={toggleAccordion}>
					<svelte:fragment slot="lead">
						<span class="material-symbols-outlined">
							barcode_scanner
						</span>
					</svelte:fragment>
					<svelte:fragment slot="summary">
						<h3 class="h3">Create printable barcode labels</h3>
					</svelte:fragment>
					<svelte:fragment slot="content"><div>
						<ul class="list">
							<li><span>&#8226;</span>
								<span class="flex-auto">Objective sampling time assessment</span>
							</li>
							<li><span>&#8226;</span>
								<span class="flex-auto">Customize the number of saliva samples per day, the number of days, and the number of study participants</span>
							</li>
							<li><span>&#8226;</span>
								<span class="flex-auto">Add an optional evening saliva sample</span>
							</li>
							<li><span>&#8226;</span>
								<span class="flex-auto">Customize barcodes to fit your printable label templates</span>
							</li>
						</ul>
					</div></svelte:fragment>
				</AccordionItem>
				<AccordionItem id="app" on:toggle={toggleAccordion}>
					<svelte:fragment slot="lead">
						<span class="material-symbols-outlined">
							phone_iphone
						</span>
					</svelte:fragment>
					<svelte:fragment slot="summary">
						<h3 class="h3">Use CARWatch app during your study</h3>
					</svelte:fragment>
					<svelte:fragment slot="content">
						<ul class="list">
							<li><span>&#8226;</span>
								<span class="flex-auto">Download App from <a href="https://play.google.com/store/apps/details?id=de.fau.cs.mad.carwatch">Google Playstore</a></span>
							</li>
							<li><span>&#8226;</span>
								<span class="flex-auto">Scan QR-Code to configure app for your study</span>
							</li>
							<li><span>&#8226;</span>
								<span class="flex-auto">Schedule and track sampling times in the app</span>
							</li>
						</ul>
					</svelte:fragment>
				</AccordionItem>
				<AccordionItem id="data" open on:toggle={toggleAccordion}>
					<svelte:fragment slot="lead">
						<span class="material-symbols-outlined">
							quick_reference_all
						</span>
					</svelte:fragment>
					<svelte:fragment slot="summary">
						<h3 class="h3">Analyze CARWatch log data</h3>
					</svelte:fragment>
					<svelte:fragment slot="content">
						<ul class="list">
							<li><span>&#8226;</span>
								<span class="flex-auto">Extract the sampling timestamps from the log data</span>
							</li>
							<li><span>&#8226;</span>
								<span class="flex-auto">Extract the self-reported awakening times (if available)</span>
							</li>
						</ul>
					</svelte:fragment>
				</AccordionItem>
			</Accordion>
		</div>
	</div>
	<div class="md:w-[700px] w-full xl:h-[400px] h-1/2 hidden md:inline-block mx-auto card p-8 variant-glass-primary">
		<img src={setup} alt="CARWatch Features" id="demo-img" class="h-full m-auto object-contain">
	</div>
</div>
