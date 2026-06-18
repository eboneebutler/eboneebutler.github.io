function manageLayout ()
{
	var d_pcap=document.getElementById('d_pcap');
	var pcap_checked=document.getElementById('PCAP').checked;
	if(pcap_checked){
		d_pcap.style.display="block";
	}else {
		d_pcap.style.display="none";
		uncheckCheckboxes(d_pcap);
	}

	var d_hcap=document.getElementById('d_hcap');
	var hcap_checked=document.getElementById('HCAP').checked;
	if(hcap_checked){
		d_hcap.style.display="block";
	}else {
		d_hcap.style.display="none";
		uncheckCheckboxes(d_hcap);
	}
}
window.onload=manageLayout;
	