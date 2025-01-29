import { LeanIMT } from '@openpassport/zk-kit-lean-imt';
import { poseidon2 } from 'poseidon-lite';
import {
  CertificateData,
} from './certificate_parsing/dataStructure';
import { packBytesAndPoseidon } from './hash';
import { DscCertificateMetaData, parseDscCertificateData } from './passports/passport_parsing/parseDscCertificateData';
import { parseCertificateSimple } from './certificate_parsing/parseCertificateSimple';
import { max_csca_bytes } from '../constants/constants';
import { max_dsc_bytes } from '../constants/constants';

export async function fetchTreeFromUrl(url: string): Promise<LeanIMT> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const commitmentMerkleTree = await response.json();
  console.log('\x1b[90m%s\x1b[0m', 'commitment merkle tree: ', commitmentMerkleTree);
  const tree = LeanIMT.import((a, b) => poseidon2([a, b]), commitmentMerkleTree);
  return tree;
}

export function getLeaf(parsed: CertificateData, type: 'dsc' | 'csca'): string {
  const maxPaddedLength = type === 'dsc' ? max_dsc_bytes : max_csca_bytes;
  const tbsBytesArray = Array.from(parsed.tbsBytes);
  const paddedTbsBytesArray = tbsBytesArray.concat(new Array(maxPaddedLength - tbsBytesArray.length).fill(0));
  return packBytesAndPoseidon(paddedTbsBytesArray);
}

export function getLeafDscTreeFromDscCertificateMetadata(dscParsed: CertificateData, dscMetaData: DscCertificateMetaData): string {
  const cscaParsed = parseCertificateSimple(dscMetaData.csca);
  return getLeafDscTree(dscParsed, cscaParsed);
}

export function getLeafDscTreeFromParsedDsc(dscParsed: CertificateData): string {
  return getLeafDscTreeFromDscCertificateMetadata(dscParsed, parseDscCertificateData(dscParsed));
}

export function getLeafDscTree(dsc_parsed: CertificateData, csca_parsed: CertificateData): string {
  const dscLeaf = getLeaf(dsc_parsed, 'dsc');
  const cscaLeaf = getLeaf(csca_parsed, 'csca');
  return poseidon2([dscLeaf, cscaLeaf]).toString();
}

export function getLeafCscaTree(csca_parsed: CertificateData): string {
  return getLeaf(csca_parsed, 'csca');
}
