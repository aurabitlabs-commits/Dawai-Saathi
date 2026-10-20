import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import TextRecognition from '@react-native-ml-kit/text-recognition';

type Props = { onUseText: (text: string) => void; language: 'en' | 'hi' };
export default function PrescriptionIntake({ onUseText, language }: Props) {
  const [busy, setBusy] = useState(false);
  const [fileName, setFileName] = useState('');
  const [text, setText] = useState('');
  const hi = language === 'hi';
  const t = (en: string, hn: string) => hi ? hn : en;
  const select = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: ['image/jpeg', 'image/png', 'image/webp'], copyToCacheDirectory: true, multiple: false });
      if (result.canceled || !result.assets?.[0]) return;
      const file = result.assets[0];
      setFileName(file.name);
      setBusy(true);
      setText('');
      const recognized = await TextRecognition.recognize(file.uri);
      const extracted = (recognized?.text ?? '').trim();
      if (!extracted) {
        Alert.alert(t('No readable text found', 'पढ़ने योग्य टेक्स्ट नहीं मिला'), t('Try a sharp, well-lit photo with the whole prescription in frame.', 'साफ़ और अच्छी रोशनी वाली तस्वीर लें, जिसमें पूरा पर्चा दिखे।'));
      }
      setText(extracted);
    } catch (e) {
      Alert.alert(t('Could not read prescription', 'पर्चा पढ़ा नहीं जा सका'), t('Use a clear prescription image. If this continues, enter the medicine details manually.', 'पर्चे की साफ़ तस्वीर चुनें। समस्या बनी रहे तो दवा की जानकारी स्वयं दर्ज करें।') + '\n' + String(e));
    } finally { setBusy(false); }
  };
  const doseLines = text.split(/\n+/).map(x => x.trim()).filter(x => x && /\d|mg|mcg|ml|tablet|tab|capsule|cap|daily|once|twice|bd|tds|od|\u092e\u093f\u0932\u0940|\u0926\u093f\u0928/i.test(x));
  return <ScrollView contentContainerStyle={s.wrap}>
    <View style={s.hero}><Text style={s.eyebrow}>{t('PRESCRIPTION SCAN', 'पर्चा स्कैन')}</Text><Text style={s.title}>{t('Turn a prescription into a draft.','पर्चे से दवा की जानकारी निकालें।')}</Text><Text style={s.subtitle}>{t('Choose a photo of the prescription. Text is recognised on this device; nothing is uploaded to a server. OCR can misread handwriting or abbreviations, so every field must be checked against the original by you or a clinician before saving.','पर्चे की तस्वीर चुनें। टेक्स्ट इसी फ़ोन पर पढ़ा जाता है; सर्वर पर अपलोड नहीं होता। OCR लिखावट या संक्षिप्त शब्द गलत पढ़ सकता है, इसलिए सेव करने से पहले मूल पर्चे से हर जानकारी मिलाएँ।')}</Text><Pressable accessibilityRole="button" onPress={() => void select()} style={s.button}><Text style={s.buttonText}>{t('＋ Choose prescription photo', '＋ पर्चे की तस्वीर चुनें')}</Text></Pressable>{busy && <View style={s.loading}><ActivityIndicator color="#087F72" /><Text style={s.subtitle}>{t('Reading image on this phone…','फ़ोन पर तस्वीर पढ़ी जा रही है…')}</Text></View>}{!!fileName && <Text style={s.file}>{t('Selected: ', 'चुना गया: ')}{fileName}</Text>}</View>
    {!!text && <View style={s.card}><Text style={s.sectionTitle}>{t('Review extracted text','निकाला गया टेक्स्ट जाँचें')}</Text><Text style={s.warning}>{t('DRAFT ONLY · Do not take or schedule a dose from OCR alone. Confirm name, strength, dose, frequency and duration against the signed prescription.','केवल ड्राफ़्ट · केवल OCR के आधार पर दवा न लें या समय तय न करें। नाम, ताकत, खुराक, आवृत्ति और अवधि मूल पर्चे से मिलाएँ।')}</Text><Text selectable style={s.extracted}>{text}</Text><Text style={s.sectionTitle}>{t('Lines that may contain medicine details','दवा की जानकारी वाली संभावित पंक्तियाँ')}</Text>{(doseLines.length ? doseLines : text.split(/\n+/).filter(x=>x.trim())).slice(0,20).map((line,i)=><View key={i} style={s.line}><Text selectable style={s.lineText}>{line}</Text></View>)}<Pressable accessibilityRole="button" onPress={() => onUseText(text)} style={s.button}><Text style={s.buttonText}>{t('Use as draft for a medicine entry →','दवा दर्ज करने के लिए ड्राफ़्ट बनाएँ →')}</Text></Pressable><Text style={s.small}>{t('This fills only a draft name/strength where recognisable. Schedule and dose are never inferred automatically. Check all details before saving.','यह केवल पहचान में आने पर नाम/ताकत का ड्राफ़्ट भरेगा। समय-सारणी और खुराक अपने-आप तय नहीं होंगी। सेव करने से पहले सब जाँचें।')}</Text></View>}
    <View style={s.card}><Text style={s.sectionTitle}>{t('Photo tips','तस्वीर के सुझाव')}</Text><Text style={s.subtitle}>{t('Use a JPG or PNG photo, avoid shadows and blur, keep all medicine lines visible, and make sure the text is large enough to read. PDFs are not supported by this first OCR version.','JPG या PNG तस्वीर लें, धुंधलापन और छाया न हो, दवा की सभी पंक्तियाँ दिखें। इस शुरुआती OCR संस्करण में PDF समर्थित नहीं है।')}</Text></View>
  </ScrollView>;
}
const s = StyleSheet.create({wrap:{padding:16,paddingBottom:36,gap:14},hero:{backgroundColor:'#103A56',borderRadius:24,padding:22,gap:12},eyebrow:{color:'#A9E4D4',fontSize:12,fontWeight:'900',letterSpacing:1.5},title:{fontSize:27,lineHeight:33,fontWeight:'900',color:'#fff'},subtitle:{fontSize:15,lineHeight:23,color:'#D6E4EA'},button:{backgroundColor:'#087F72',minHeight:54,padding:14,borderRadius:14,alignItems:'center',justifyContent:'center',marginTop:4},buttonText:{fontSize:16,fontWeight:'900',color:'#fff',textAlign:'center'},loading:{flexDirection:'row',alignItems:'center',gap:10},file:{color:'#fff',fontSize:13},card:{backgroundColor:'#fff',borderRadius:20,padding:18,gap:12,borderWidth:1,borderColor:'#DCE7E5'},sectionTitle:{fontSize:18,fontWeight:'900',color:'#103A56'},warning:{backgroundColor:'#FFF2D7',color:'#80540A',padding:12,borderRadius:12,fontSize:13,lineHeight:20,fontWeight:'700'},extracted:{fontSize:15,lineHeight:24,color:'#243F50',backgroundColor:'#F4F8F7',padding:14,borderRadius:12},line:{borderBottomWidth:1,borderBottomColor:'#E3ECE9',paddingVertical:10},lineText:{fontSize:15,lineHeight:22,color:'#243F50'},small:{fontSize:12,lineHeight:18,color:'#657985'}
});
