"""
MongoDB Simulator for Testing
Provides a simple in-memory simulation of MongoDB operations for testing when MongoDB is not available
"""

import json
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
from collections import defaultdict

logger = logging.getLogger(__name__)

class MongoDBSimulator:
    """In-memory MongoDB simulator for testing"""
    
    def __init__(self):
        self.collections = defaultdict(list)
        self.indexes = defaultdict(list)
        self.connected = False
        
    def connect(self):
        """Simulate MongoDB connection"""
        self.connected = True
        logger.info("🔧 Using MongoDB Simulator (MongoDB not available)")
        return True
    
    def disconnect(self):
        """Simulate disconnection"""
        self.connected = False
        logger.info("Disconnected from MongoDB Simulator")
    
    def ping(self):
        """Simulate ping command"""
        return {"ok": 1} if self.connected else {"ok": 0}
    
    def create_collection(self, name: str, **kwargs):
        """Simulate collection creation"""
        if name not in self.collections:
            self.collections[name] = []
            logger.info(f"Created simulated collection: {name}")
        return True
    
    def list_collection_names(self):
        """List all collection names"""
        return list(self.collections.keys())
    
    def get_collection(self, name: str):
        """Get a collection simulator"""
        return CollectionSimulator(name, self.collections[name])
    
    def command(self, command: str):
        """Simulate database commands"""
        if command == "ping":
            return self.ping()
        elif command == "dbStats":
            return {
                "db": "interview_mentor_simulator",
                "collections": len(self.collections),
                "dataSize": sum(len(json.dumps(doc)) for docs in self.collections.values() for doc in docs),
                "storageSize": 0,
                "indexes": len(self.indexes),
                "ok": 1
            }
        return {"ok": 1}

class CollectionSimulator:
    """Simulate MongoDB collection operations"""
    
    def __init__(self, name: str, data: List[Dict]):
        self.name = name
        self.data = data
        self._id_counter = 1
    
    def insert_one(self, document: Dict):
        """Simulate insert_one operation"""
        doc = document.copy()
        if "_id" not in doc:
            doc["_id"] = self._id_counter
            self._id_counter += 1
        
        self.data.append(doc)
        
        class InsertResult:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id
        
        return InsertResult(doc["_id"])
    
    def insert_many(self, documents: List[Dict]):
        """Simulate insert_many operation"""
        inserted_ids = []
        for doc in documents:
            result = self.insert_one(doc)
            inserted_ids.append(result.inserted_id)
        
        class InsertManyResult:
            def __init__(self, inserted_ids):
                self.inserted_ids = inserted_ids
        
        return InsertManyResult(inserted_ids)
    
    def find_one(self, filter_dict: Dict = None):
        """Simulate find_one operation"""
        if not filter_dict:
            return self.data[0] if self.data else None
        
        for doc in self.data:
            if self._matches_filter(doc, filter_dict):
                return doc
        return None
    
    def find(self, filter_dict: Dict = None):
        """Simulate find operation"""
        if not filter_dict:
            return QuerySimulator(self.data)
        
        matching_docs = [doc for doc in self.data if self._matches_filter(doc, filter_dict)]
        return QuerySimulator(matching_docs)
    
    def update_one(self, filter_dict: Dict, update_dict: Dict, upsert: bool = False):
        """Simulate update_one operation"""
        for i, doc in enumerate(self.data):
            if self._matches_filter(doc, filter_dict):
                if "$set" in update_dict:
                    doc.update(update_dict["$set"])
                else:
                    doc.update(update_dict)
                
                class UpdateResult:
                    def __init__(self, modified_count):
                        self.modified_count = modified_count
                
                return UpdateResult(1)
        
        # If no document found and upsert is True
        if upsert:
            new_doc = filter_dict.copy()
            if "$set" in update_dict:
                new_doc.update(update_dict["$set"])
            else:
                new_doc.update(update_dict)
            self.insert_one(new_doc)
            
            class UpdateResult:
                def __init__(self, modified_count):
                    self.modified_count = modified_count
            
            return UpdateResult(0)  # No modification, but upserted
        
        class UpdateResult:
            def __init__(self, modified_count):
                self.modified_count = modified_count
        
        return UpdateResult(0)
    
    def replace_one(self, filter_dict: Dict, replacement: Dict, upsert: bool = False):
        """Simulate replace_one operation"""
        for i, doc in enumerate(self.data):
            if self._matches_filter(doc, filter_dict):
                # Keep the _id if it exists
                if "_id" in doc:
                    replacement["_id"] = doc["_id"]
                self.data[i] = replacement
                
                class ReplaceResult:
                    def __init__(self, modified_count):
                        self.modified_count = modified_count
                
                return ReplaceResult(1)
        
        # If no document found and upsert is True
        if upsert:
            self.insert_one(replacement)
            
            class ReplaceResult:
                def __init__(self, modified_count):
                    self.modified_count = modified_count
            
            return ReplaceResult(0)
        
        class ReplaceResult:
            def __init__(self, modified_count):
                self.modified_count = modified_count
        
        return ReplaceResult(0)
    
    def delete_one(self, filter_dict: Dict):
        """Simulate delete_one operation"""
        for i, doc in enumerate(self.data):
            if self._matches_filter(doc, filter_dict):
                del self.data[i]
                
                class DeleteResult:
                    def __init__(self, deleted_count):
                        self.deleted_count = deleted_count
                
                return DeleteResult(1)
        
        class DeleteResult:
            def __init__(self, deleted_count):
                self.deleted_count = deleted_count
        
        return DeleteResult(0)
    
    def delete_many(self, filter_dict: Dict):
        """Simulate delete_many operation"""
        deleted_count = 0
        self.data[:] = [doc for doc in self.data if not self._matches_filter(doc, filter_dict)]
        
        class DeleteResult:
            def __init__(self, deleted_count):
                self.deleted_count = deleted_count
        
        return DeleteResult(deleted_count)
    
    def count_documents(self, filter_dict: Dict = None):
        """Simulate count_documents operation"""
        if not filter_dict:
            return len(self.data)
        
        return len([doc for doc in self.data if self._matches_filter(doc, filter_dict)])
    
    def create_indexes(self, indexes):
        """Simulate index creation"""
        return [f"index_{i}" for i in range(len(indexes))]
    
    def list_indexes(self):
        """Simulate list_indexes operation"""
        return [{"name": "_id_"}, {"name": "simulated_index"}]
    
    def _matches_filter(self, document: Dict, filter_dict: Dict) -> bool:
        """Check if document matches filter"""
        for key, value in filter_dict.items():
            if key not in document:
                return False
            if document[key] != value:
                return False
        return True

class QuerySimulator:
    """Simulate MongoDB query cursor"""
    
    def __init__(self, data: List[Dict]):
        self.data = data
    
    def sort(self, key: str, direction: int = 1):
        """Simulate sort operation"""
        reverse = direction == -1
        self.data.sort(key=lambda x: x.get(key, ""), reverse=reverse)
        return self
    
    def limit(self, count: int):
        """Simulate limit operation"""
        self.data = self.data[:count]
        return self
    
    def __iter__(self):
        """Make iterable"""
        return iter(self.data)
    
    def __list__(self):
        """Convert to list"""
        return self.data

# Global simulator instance
mongodb_simulator = MongoDBSimulator()

def get_simulator():
    """Get MongoDB simulator instance"""
    return mongodb_simulator
