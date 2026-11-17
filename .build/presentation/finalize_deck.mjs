import path from 'node:path';
import { pathToFileURL } from 'node:url';

const skill='C:/Users/aimee/.codex/plugins/cache/openai-primary-runtime/presentations/26.1111.10930/skills/presentations';
const workspaceDir='C:/Users/aimee/Documents/Codex/2026-11-12/referenced-chatgpt-conversation-this-is-an';
const candidatePath=path.join(workspaceDir,'outputs/READY72/.build/presentation/READY72_DataStory_Draft.pptx');
const finalPath=path.join(workspaceDir,'outputs/READY72/submission/READY72_DataStory_Capstone.pptx');
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
const result=await finalizePresentation({
  workspaceDir,
  candidatePath,
  finalPath,
  pythonExecutable:'C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1111-570-0_26.1111.570.0_x64__3k8sg7r9htsxt/dependencies/python/python.exe',
  integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),
  layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),
  layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-heading-fit'],
  requiredNativeChartOwnerSlides:[5],
  materializeLiteralChartWorkbooks:true,
  nativeChartTargetApplication:'powerpoint',
  fontPolicy:{basis:'design',families:['Arial']},
  verifyArtifactToolImport:true,
  receiptPath:path.join(workspaceDir,'outputs/READY72/.build/presentation/READY72_DataStory_Capstone.validation.json')
});
console.log(JSON.stringify(result,null,2));
