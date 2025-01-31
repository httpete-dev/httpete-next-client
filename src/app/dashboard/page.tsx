'use client'

import { baseUrl, BaseUrl, Collection, Doc, Endpoint, Workspace, } from "~/model"
import { useState, useRef, useEffect } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Send, Save, Plus, Eye, EyeOff } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog"
import dynamic from "next/dynamic"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"
import LeftSideBar, { UrlParams } from "~/components/sidebar/left-sidebar"
import { DashboardPageProps, isMobile } from "~/app/dashboard/layout"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { useRouter, useSearchParams } from 'next/navigation'
import Loading from "~/components/Loading"
import axios from "axios"
import { prettifyJson } from "~/lib/utils"
import TestsForEndpoint from "~/components/TestsForEndpoint"
import MarkdownEditor from "~/components/markdown-editor"
import { addBaseUrl } from "~/server/baseUrls"
import ManageBaseUrlsDialog from "~/components/api-client/ManageBaseUrlsDialog"
import toastr from "toastr"
import EnvironmentVariables from "~/components/api-client/EnvironmentVariables"
import WysiwygEditor from "~/components/documentation/WYSIYYGEditor"
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: true });

const pulsingAnimation = `
  @keyframes pulse {
    0%, 100% { background-color: rgba(6, 182, 212, 0.5); }
    50% { background-color: rgba(255, 127, 80, 0.5); }
  }
`

const styles = {
  loadingAnimation: {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
}

const Dashboard = (props: DashboardPageProps) => {

  const [responseData, setResponseData] = useState("")
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUnsavedChangesDialogOpen, setIsUnsavedChangesDialogOpen] = useState(false)
  const workspaceNameInputRef = useRef(null)
  const [isNewWorkspaceModalOpen, setIsNewWorkspaceModalOpen] = useState(false)
  const [editingDoc, setEditingDoc] = useState(false);
  const docContentRef = useRef(null);
  const [activeTab, setActiveTab] = useState("request");
  const [doc, setDoc] = useState('');// TODO:
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const searchParams = useSearchParams();
  const [showDocs, setShowDocs] = useState(true);
  const [pageLoading, setPageLoading] = useState(false)


  const handleTabClick = (value: string) => {
    setActiveTab(value); // Update the active tab state
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (workspaceNameInputRef.current && !workspaceNameInputRef.current.contains(event.target as Node)) {
        // handleWorkspaceNameEdit(workspaceNameInputRef.current.value)
      }

      else if (docContentRef.current && !docContentRef.current.contains(event.target as Node)) {
        // handleDocContentChange(docContentRef.current.value)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])


  useEffect(() => {
    const collectionId = parseInt(searchParams.get('collectionId') ?? '-1');
    const endpointId = parseInt(searchParams.get('endpointId') ?? '-1');
    const collection = props.collections?.find(x => x.id === collectionId)
    const endpoint = props.getEndpoint(collection ?? {} as Collection, endpointId)

    if (collection && collectionId.toString() !== searchParams.get('collectionId')) {
      props.activeEndpoint.method = endpoint?.method ?? props.activeEndpoint.method;
      props.activeEndpoint.baseUrlId = endpoint?.baseUrl?.id ?? props.activeEndpoint.baseUrlId;
      props.activeEndpoint.baseUrl = endpoint?.baseUrl ?? props.activeEndpoint.baseUrl;
    } else {
      props.activeEndpoint.method = endpoint?.method ?? props.activeEndpoint.method;
      props.activeEndpoint.baseUrlId = endpoint?.baseUrl?.id ?? props.activeEndpoint.baseUrlId;
      props.activeEndpoint.baseUrl = endpoint?.baseUrl ?? props.activeEndpoint.baseUrl;
    }

    if (!props.endpoints || collectionId !== props.endpoints[0]?.collectionId) {
      const collection = props.getCollection(collectionId);

      if (collection) {
        props.setActiveCollection(collectionId);
        props.updateActiveEndpoint((props.endpoints?.find(x => x.id === endpointId) ?? { id: -1 } as Endpoint).id);
      }

    }

    if (props.activeEndpoint.baseUrl === null) {
      props.activeEndpoint.baseUrl = props.baseUrls.find(x => x.id === props.activeEndpoint.baseUrlId)
        ?? props.baseUrls[0]
        ?? props.activeEndpoint.baseUrl;
    }


    console.log('active Endpoint', props.activeEndpoint)
    console.log('search params', searchParams.toString())
  }, [searchParams])

  useEffect(() => {
    setPageLoading(false);
  }, [props.getEndpoint(props.getCollection(parseInt(searchParams?.get('collectionId') ?? '-1')) ?? {} as Collection, parseInt(searchParams?.get('endpointId') ?? '-1'))])


  function getResponse() {
    if (!responseData)
      return


    var obj = JSON.parse(responseData ?? '{}')
    if (obj.data?.headers) {
      obj.data.headers = JSON.parse((obj.data.headers + ""))
    }

    if (obj.data?.body) {
      obj.data.body = JSON.parse((obj.data.body + ""))
    }

    if (obj.data?.config?.data) {
      obj.data.config.data = 5;
    }
    return JSON.stringify(obj, null, 2)
  }


  return (
    <>

      <div className="flex bg-gray-900 text-gray-100">
        <style>{pulsingAnimation}</style>

        {/* Left Sidebar */}
        {!isMobile() && <LeftSideBar
          activeEndpoint={props.activeEndpoint}
          collections={props.collections}

          // setCollectionsLoading={props.setCollectionsLoading}
          collectionsLoading={props.collectionsLoading}
          baseUrls={props.baseUrls}
          updateCollections={props.updateCollections}
          setLoading={setPageLoading}
          updateParams={props.updateParams}
          buildUrlParams={props.buildUrlParams}
          activeCollection={props.activeCollection}
          setActiveEndpoint={props.setActiveEndpoint}
          setIsModalOpen={setIsNewWorkspaceModalOpen}
          addWorkspace={() => { }}
          activeWorkspace={{} as Workspace}
          setActiveWorkspace={() => { }}
          setActiveCollection={props.setActiveCollection}
          sendDataToParent={() => { }} />}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {pageLoading && <LoadingSpinner />}
          <>
            <main className="flex-1 p-6 overflow-auto">

              {/* <EndpointDetails end={props.activeEndpoint} /> */}

              <Tabs defaultValue="request" className="w-full h-full">
                <div className="flex justify-between items-center mb-4">
                  <TabsList className="flex flex-row gap-0" >
                    <TabsTrigger
                      value="request"
                      className="TabsTrigger"
                      onClick={() => handleTabClick("request")} // Handle tab click
                    >
                      Request
                    </TabsTrigger>
                    <TabsTrigger
                      value="docs"
                      className="TabsTrigger"
                      onClick={() => handleTabClick("docs")} // Handle tab click
                    >
                      Documentation
                    </TabsTrigger>
                    <TabsTrigger
                      value="environment"
                      className="TabsTrigger"
                      onClick={() => handleTabClick("environment")} // Handle tab click
                    >
                      Environment
                    </TabsTrigger>

                    <TabsTrigger
                      value="tests"
                      className="TabsTrigger"
                      onClick={() => handleTabClick("tests")} // Handle tab click
                    >
                      Tests
                    </TabsTrigger>
                  </TabsList>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { }} // TODO:
                    disabled={!props?.isDocumentationChanged}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
                <TabsContent className="flex flex-col" value="request">
                  <div className="flex space-x-2">
                    <select
                      className="bg-gray-700 border border-gray-600 rounded px-2 py-1"
                      value={props.activeEndpoint.method}
                      onChange={(e) => {
                        if (e.target.value === 'GET' || e.target.value === 'POST' || e.target.value === 'PUT' || e.target.value === 'PATCH' || e.target.value === 'DELETE') {
                          props.activeEndpoint.method = e.target.value;
                        } else {
                          toastr.error('Invalid method');
                        }
                      }}
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option>PUT</option>
                      <option>PATCH</option>
                      <option>DELETE</option>
                    </select>
                    <select
                      className="bg-gray-700 border border-gray-600 rounded px-2 py-1"
                      value={props.activeEndpoint.baseUrl?.protocol}
                      onChange={(e) => {
                        if (!props.activeEndpoint.baseUrl) {
                          props.activeEndpoint.baseUrl = props.baseUrls[0]!;
                        }

                        props.activeEndpoint.baseUrl.protocol = e.target.value;
                        console.log('protocol', props.activeEndpoint.baseUrl?.protocol)
                      }}
                    >
                      <option>HTTP</option>
                      <option>HTTPS</option>

                    </select>
                    <select
                      className="bg-gray-700 border border-gray-600 rounded px-2 py-1"
                      value={props.activeEndpoint.baseUrl?.value}
                      onChange={(e) => {
                        if (e.target.value === 'Manage...') {
                          setIsDialogOpen(true);
                          return;
                        }
                        props.activeEndpoint.baseUrl = props.baseUrls.find(x => x.value === e.target.value)
                          ?? props.activeEndpoint.baseUrl;
                        props.activeEndpoint.baseUrlId = props.activeEndpoint.baseUrl?.id ?? props.activeEndpoint.baseUrlId;
                        console.log('baseUrl', props.activeEndpoint.baseUrl)
                      }}
                    >
                      {props.baseUrls?.map((x, index) => (
                        <option key={index} value={x.value}>
                          {x.value}
                        </option>
                      ))}
                      <option>Manage...</option>
                    </select>

                    <ManageBaseUrlsDialog
                      baseUrls={props.baseUrls}
                      setIsDialogOpen={setIsDialogOpen}
                      isDialogOpen={isDialogOpen}
                      activeEndpoint={props.activeEndpoint}
                      addBaseUrl={addBaseUrl} />
                    <Input
                      type="text"
                      placeholder="Enter request URL"
                      value={(props.activeEndpoint?.url ?? '')}
                      onChange={(e) => {
                        props.activeEndpoint.url = e.target.value;
                      }}
                      className="flex-1 bg-gray-700 border-gray-600 text-gray-100"
                    />
                    {/* Send Request */}
                    <Button
                      onClick={() => {


                        const endpoint = props.getEndpoint(props.getCollection(parseInt(searchParams?.get('collectionId') ?? '-1')) ?? {} as Collection, parseInt(searchParams?.get('endpointId') ?? '-1')) ?? {} as Endpoint;
                        const url = props.activeEndpoint.baseUrl?.protocol.toLowerCase() + '://' + props.activeEndpoint.baseUrl?.value + endpoint.url;

                        const request = {
                          baseURL: url,
                          method: endpoint.method,
                          headers: JSON.parse(endpoint.headers),
                          data: endpoint.body
                        };

                        console.log('sending request...', request)

                        axios(url, request).then(res => {
                          toastr.info(`[${res.status}: ${res.statusText}]`, 'Request successful: ')
                          setResponseData(JSON.stringify(res));
                        })
                          .catch(err => {
                            toastr.error(err.message, 'Unexpected error occurred:')
                          })
                      }} // TODO:
                      className={`bg-red-500 hover:bg-cyan-600 text-white ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isLoading}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {isLoading ? 'Sending...' : 'Send'}
                    </Button>
                  </div>
                  <div className="space-y-4 grid grid-cols-3">

                    <div className={"space-y-4 w-full mt-2 p-2 " + (showDocs ? "col-span-2" : "col-span-3")}>
                      <div className="space-y-4">
                        {/* <CustomGPTAgent className={""} /> */}
                        <Tabs defaultValue="headers" className="w-full">
                          <TabsList className="bg-gray-700">
                            <TabsTrigger value="headers" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">Headers</TabsTrigger>
                            <TabsTrigger value="body" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">Body</TabsTrigger>
                          </TabsList>
                          <Button
                            variant="outline"
                            className="bg-transparent p-2 absolute right-8"
                            onClick={() => {
                              setShowDocs(!showDocs)
                            }}
                          > {showDocs ? <><EyeOff /> Hide Documentation</> : <><Eye /> Show Documentation</>}</Button>
                          <TabsContent value="headers">
                            <div className="border rounded shadow-md">
                              <MonacoEditor
                                height="500px"
                                defaultLanguage="json"
                                defaultValue="{}"
                                theme="vs-dark"
                                value={prettifyJson(props.getEndpoint(props.getCollection(parseInt(searchParams?.get('collectionId') ?? '-1')) ?? {} as Collection, parseInt(searchParams?.get('endpointId') ?? '-1'))?.headers ?? '{}')!}
                                onChange={(value) => {
                                  // TODO: update endpoint
                                }}
                              />
                            </div>
                          </TabsContent>
                          <TabsContent value="body">
                            <div className="border rounded shadow-md">
                              <MonacoEditor
                                height="500px"
                                defaultLanguage="json"
                                defaultValue="{}"
                                theme="vs-dark"
                                value={prettifyJson(props.getEndpoint(props.getCollection(parseInt(searchParams?.get('collectionId') ?? '-1')) ?? {} as Collection, parseInt(searchParams?.get('endpointId') ?? '-1'))?.body ?? '{}')!}
                                onChange={(value) => {
                                  // TODO: update endpoint
                                }}
                              />
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                      <div>
                        <div className="flex flex-row justify-between">
                          <h3 className="font-semibold mb-2">Response</h3>
                          <Button disabled={responseData === ''} variant='outline' className="bg-transparent"><Save /> Save Response</Button>
                        </div>
                        <div className="border rounded shadow-md">
                          <SyntaxHighlighter language="json" style={dracula}>
                            {/* {responseData} */}
                            {getResponse()}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    </div>
                    {showDocs &&
                      // <MilkdownEditor defaultValue={props.activeEndpoint.documentation?.text ?? ""}/>
                      <WysiwygEditor endpoint={props.getEndpoint(props.getCollection(parseInt(searchParams?.get('collectionId') ?? '-1')) ?? {} as Collection, parseInt(searchParams?.get('endpointId') ?? '-1')) ?? {} as Endpoint} />
                    }

                  </div>

                </TabsContent>
                <TabsContent value="docs">
                  <div className="space-y-4">
                    <MarkdownEditor
                      activeDocument={props.getEndpoint(props.getCollection(parseInt(searchParams?.get('collectionId') ?? '-1')) ?? {} as Collection, parseInt(searchParams?.get('endpointId') ?? '-1'))?.documentation ?? {
                        title: 'Untitled'
                      } as Doc}
                      activeEndpoint={props.getEndpoint(props.getCollection(parseInt(searchParams?.get('collectionId') ?? '-1')) ?? {} as Collection, parseInt(searchParams?.get('endpointId') ?? '-1')) ?? {} as Endpoint}
                      // docTitle={endpoints?.find(x => x.id === parseInt(searchParams?.get('endpointId') ?? '-1'))?.documentation?.title ?? 'Untitled'}
                      setDocumentChanged={(changed: boolean) => {
                        // Handle document changed state
                      }}
                      setActiveEndpoint={(endpoint) => {
                        if (typeof endpoint === 'number') {
                          props.updateActiveEndpoint(endpoint);
                        }
                      }}
                      setEditingTitle={() => { }} // TODO:
                      markdown={doc}
                      setMarkdown={setDoc}
                      isMobile={isMobile()}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="tests">
                  <TestsForEndpoint endpoint={props.activeEndpoint} />
                </TabsContent>
                <TabsContent value="environment">
                  {/* <EnvironmentVariables workspaceId={props.activeWorkspace.id} /> */}
                </TabsContent>
              </Tabs>
            </main>
          </>

        </div>



        {/* Unsaved Changes Dialog */}
        <AlertDialog open={isUnsavedChangesDialogOpen} onOpenChange={setIsUnsavedChangesDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
              <AlertDialogDescription>
                You have unsaved changes. Would you like to save before exiting?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsUnsavedChangesDialogOpen(false)}>Discard</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                // handleSaveDocumentation()
                setIsUnsavedChangesDialogOpen(false)
              }}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Loading animation */}
        {isLoading && (
          <div
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            style={styles.loadingAnimation}
          >
            <div className="text-white text-2xl">Loading...</div>
          </div>
        )}
      </div>

    </>
  )
}

export default Dashboard;

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Largest circle - spins clockwise */}
        <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin" />

        {/* Medium circle - spins counter-clockwise */}
        <div className="absolute w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-[spin_1s_linear_infinite_reverse]" />

        {/* Smallest circle - spins clockwise */}
        <div className="absolute w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />

        {/* Loading text */}
        <span className="absolute text-white mt-40 text-xl">Loading...</span>
      </div>
    </div>
  );
};